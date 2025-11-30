import { UIState } from "./";
import { setThemeCookie } from "../../utils/cookies";

type UIType =
  | { type: "UI - ToggleMenu" }
  | { type: "UI - ToggleTheme" }
  | { type: "UI - SetTheme"; payload: "light" | "dark" };

export const uiReducer = (state: UIState, action: UIType): UIState => {
  switch (action.type) {
    case "UI - ToggleMenu":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };
    case "UI - ToggleTheme": {
      const newMode: "light" | "dark" =
        state.themeMode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        try {
          setThemeCookie(newMode);
        } catch (error) {
          console.warn("Error setting theme cookie:", error);
        }
      }
      return {
        ...state,
        themeMode: newMode,
      };
    }
    case "UI - SetTheme": {
      const newMode = action.payload;
      if (typeof window !== "undefined") {
        try {
          setThemeCookie(newMode);
        } catch (error) {
          console.warn("Error setting theme cookie:", error);
        }
      }
      return {
        ...state,
        themeMode: newMode,
      };
    }

    default:
      return state;
  }
};
