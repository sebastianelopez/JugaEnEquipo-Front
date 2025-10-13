import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";

export interface PasswordValidationRules {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  rules: PasswordValidationRules;
  errors: string[];
}

export const usePasswordValidation = () => {
  const t = useTranslations("Validation");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validatePassword = useCallback(
    (pwd: string): PasswordValidationResult => {
      const rules: PasswordValidationRules = {
        minLength: pwd.length >= 8,
        hasUpperCase: /[A-Z]/.test(pwd),
        hasLowerCase: /[a-z]/.test(pwd),
        hasNumber: /\d/.test(pwd),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      };

      const errors: string[] = [];
      if (!rules.minLength) errors.push(t("minLength"));
      if (!rules.hasUpperCase) errors.push(t("hasUpperCase"));
      if (!rules.hasLowerCase) errors.push(t("hasLowerCase"));
      if (!rules.hasNumber) errors.push(t("hasNumber"));
      if (!rules.hasSpecialChar) errors.push(t("hasSpecialChar"));

      const isValid = Object.values(rules).every((rule) => rule);

      return { isValid, rules, errors };
    },
    [t]
  );

  const validation = useMemo(
    () => validatePassword(password),
    [password, validatePassword]
  );

  const passwordsMatch = useMemo(
    () => password === confirmPassword && password.length > 0,
    [password, confirmPassword]
  );

  const confirmPasswordError = useMemo(() => {
    if (confirmPassword.length === 0) return "";
    return passwordsMatch ? "" : t("passwordsDontMatch");
  }, [confirmPassword, passwordsMatch, t]);

  const isFormValid = useMemo(
    () => validation.isValid && passwordsMatch,
    [validation.isValid, passwordsMatch]
  );

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    validation,
    passwordsMatch,
    confirmPasswordError,
    isFormValid,
    validatePassword,
  };
};
