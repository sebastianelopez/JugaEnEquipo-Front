import { UIState } from "./";

type UIType = {
  type: "UI - ToggleMenu";
};

export const uiReducer = (state: UIState, action: UIType): UIState => {
  switch (action.type) {
    case "UI - ToggleMenu":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };

    default:
      return state;
  }
};
