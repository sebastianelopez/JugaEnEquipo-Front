import { FC, PropsWithChildren, useReducer } from "react";
import { FeedbackContext, FeedbackOptions } from "./FeedbackContext";
import { feedbackReducer } from "./feedbackReducer";
import { ErrorDialog } from "../../components/molecules/Feedback/ErrorDialog";
import { SuccessDialog } from "../../components/molecules/Feedback/SuccessDialog";

export interface FeedbackState {
  errorOpen: boolean;
  successOpen: boolean;
  errorOptions: FeedbackOptions;
  successOptions: FeedbackOptions;
}

const FEEDBACK_INITIAL_STATE: FeedbackState = {
  errorOpen: false,
  successOpen: false,
  errorOptions: {},
  successOptions: {},
};

export const FeedbackProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(feedbackReducer, FEEDBACK_INITIAL_STATE);

  const showError = (options: FeedbackOptions) => {
    dispatch({ type: "Feedback - ShowError", payload: options });
  };

  const showSuccess = (options: FeedbackOptions) => {
    dispatch({ type: "Feedback - ShowSuccess", payload: options });
  };

  const hideError = () => {
    dispatch({ type: "Feedback - HideError" });
  };

  const hideSuccess = () => {
    dispatch({ type: "Feedback - HideSuccess" });
  };

  const handleSuccessClose = () => {
    if (state.successOptions.onClose) {
      state.successOptions.onClose();
    }
    hideSuccess();
  };

  return (
    <FeedbackContext.Provider
      value={{
        ...state,

        // Methods
        showError,
        showSuccess,
        hideError,
        hideSuccess,
      }}
    >
      {children}

      <ErrorDialog
        open={state.errorOpen}
        title={state.errorOptions.title}
        message={state.errorOptions.message}
        onClose={hideError}
        onRetry={state.errorOptions.onRetry}
        retryLabel={state.errorOptions.retryLabel}
      />

      <SuccessDialog
        open={state.successOpen}
        title={state.successOptions.title}
        message={state.successOptions.message}
        onClose={handleSuccessClose}
        closeLabel={state.successOptions.closeLabel}
      />
    </FeedbackContext.Provider>
  );
};
