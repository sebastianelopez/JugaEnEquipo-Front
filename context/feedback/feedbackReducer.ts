import { FeedbackOptions } from "./FeedbackContext";
import { FeedbackState } from "./FeedbackProvider";

type FeedbackActionType =
  | { type: "Feedback - ShowError"; payload: FeedbackOptions }
  | { type: "Feedback - ShowSuccess"; payload: FeedbackOptions }
  | { type: "Feedback - HideError" }
  | { type: "Feedback - HideSuccess" };

export const feedbackReducer = (
  state: FeedbackState,
  action: FeedbackActionType
): FeedbackState => {
  switch (action.type) {
    case "Feedback - ShowError":
      return {
        ...state,
        errorOpen: true,
        errorOptions: action.payload,
      };

    case "Feedback - ShowSuccess":
      return {
        ...state,
        successOpen: true,
        successOptions: action.payload,
      };

    case "Feedback - HideError":
      return {
        ...state,
        errorOpen: false,
      };

    case "Feedback - HideSuccess":
      return {
        ...state,
        successOpen: false,
      };

    default:
      return state;
  }
};
