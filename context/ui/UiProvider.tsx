import { FC, PropsWithChildren, useEffect, useReducer } from "react";
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

  // Sync with cookie after mount and enable smooth transitions
  useEffect(() => {
    try {
      const cookieTheme = getThemeFromCookie();
      if (cookieTheme !== state.themeMode) {
        dispatch({ type: "UI - SetTheme", payload: cookieTheme });
      }
      
      // Enable smooth theme transitions after hydration
      setTimeout(() => {
        if (typeof window !== "undefined") {
          document.body.classList.add('theme-transitions');
        }
      }, 100);
    } catch (error) {
      console.warn("Error reading theme cookie:", error);
    }
  }, []);

  // Update document attributes when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute('data-theme', state.themeMode);
      document.body.className = `${state.themeMode}-theme theme-transitions`;
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
