import { createContext } from "react";

export interface FeedbackOptions {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  closeLabel?: string;
  onClose?: () => void;
}

interface ContextProps {
  // State
  errorOpen: boolean;
  successOpen: boolean;
  errorOptions: FeedbackOptions;
  successOptions: FeedbackOptions;

  // Methods
  showError: (options: FeedbackOptions) => void;
  showSuccess: (options: FeedbackOptions) => void;
  hideError: () => void;
  hideSuccess: () => void;
}

export const FeedbackContext = createContext({} as ContextProps);
