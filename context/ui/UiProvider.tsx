import { FC, PropsWithChildren, useEffect, useReducer } from "react";
import { UiContext, uiReducer } from "./";

export interface UIState {
  isMenuOpen: boolean;
  themeMode: "light" | "dark";
}

const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false,
  themeMode:
    typeof window === "undefined"
      ? "light"
      : (localStorage.getItem("themeMode") as "light" | "dark") || "light",
};

export const UiProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: "UI - ToggleMenu" });
  };

  const toggleTheme = () => {
    dispatch({ type: "UI - ToggleTheme" });
  };

  // Ensure theme initializes from storage after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem("themeMode") as
        | "light"
        | "dark"
        | null;
      if (stored && stored !== state.themeMode) {
        dispatch({ type: "UI - SetTheme", payload: stored });
      }
    } catch {}
  }, []);

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
