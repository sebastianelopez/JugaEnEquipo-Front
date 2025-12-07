import { FC, PropsWithChildren, useEffect, useReducer, useRef } from "react";
import { UiContext, uiReducer } from "./";
import { getThemeFromCookie, setThemeCookie } from "../../utils/cookies";

export interface UIState {
  isMenuOpen: boolean;
  themeMode: "light" | "dark";
}

interface UiProviderProps extends PropsWithChildren {
  initialTheme?: "light" | "dark";
}

const getInitialTheme = (initialTheme?: "light" | "dark"): "light" | "dark" => {
  // Priority: 1. Server-side initialTheme, 2. Client-side cookie, 3. Default
  if (initialTheme) return initialTheme;
  if (typeof window === "undefined") return "light";
  return getThemeFromCookie();
};

export const UiProvider: FC<UiProviderProps> = ({ children, initialTheme }) => {
  const UI_INITIAL_STATE: UIState = {
    isMenuOpen: false,
    themeMode: getInitialTheme(initialTheme),
  };
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: "UI - ToggleMenu" });
  };

  const toggleTheme = () => {
    dispatch({ type: "UI - ToggleTheme" });
  };

  useEffect(() => {
    try {
      const cookieTheme = getThemeFromCookie();
      if (cookieTheme !== state.themeMode) {
        dispatch({ type: "UI - SetTheme", payload: cookieTheme });
      }
      
      setTimeout(() => {
        if (typeof window !== "undefined") {
          document.body.classList.add('theme-transitions');
        }
      }, 100);

      const handlePreferencesChange = (event: CustomEvent) => {
        if (event.detail.type === "theme") {
          const newTheme = event.detail.value as "light" | "dark";
          if (newTheme !== state.themeMode) {
            dispatch({ type: "UI - SetTheme", payload: newTheme });
          }
        }
      };

      window.addEventListener("user-preferences-changed", handlePreferencesChange as EventListener);

      return () => {
        window.removeEventListener("user-preferences-changed", handlePreferencesChange as EventListener);
      };
    } catch (error) {
      console.warn("Error reading theme cookie:", error);
    }
  }, [state.themeMode]);

  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute('data-theme', state.themeMode);
      document.body.className = `${state.themeMode}-theme theme-transitions`;
      
      if (!isInitialMountRef.current) {
        window.dispatchEvent(
          new CustomEvent("theme-changed", {
            detail: { theme: state.themeMode },
          })
        );
      } else {
        isInitialMountRef.current = false;
      }
    }
  }, [state.themeMode]);

  return (
    <UiContext.Provider
      value={{
        ...state,

        //Methods
        toggleSideMenu,
        toggleTheme,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
