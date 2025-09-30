import { UIState } from "./";

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
          localStorage.setItem("themeMode", newMode);
        } catch {}
      }
      return {
        ...state,
        themeMode: newMode,
      };
    }
    case "UI - SetTheme": {
      const newMode = action.payload;
      return {
        ...state,
        themeMode: newMode,
      };
    }

    default:
      return state;
  }
};
