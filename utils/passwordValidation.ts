import * as Yup from "yup";

export const PASSWORD_PATTERNS = {
  minLength: /.{8,}/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

export const passwordValidationSchema = (t: (key: string) => string) => {
  return Yup.string()
    .min(8, t("minLength"))
    .matches(PASSWORD_PATTERNS.hasUpperCase, t("hasUpperCase"))
    .matches(PASSWORD_PATTERNS.hasLowerCase, t("hasLowerCase"))
    .matches(PASSWORD_PATTERNS.hasNumber, t("hasNumber"))
    .matches(PASSWORD_PATTERNS.hasSpecialChar, t("hasSpecialChar"))
    .required(t("required"));
};

export const confirmPasswordValidationSchema = (
  t: (key: string) => string,
  fieldName: string = "password"
) => {
  return Yup.string()
    .oneOf([Yup.ref(fieldName)], t("passwordsDontMatch"))
    .required(t("required"));
};

export const checkPasswordStrength = (password: string) => {
  const checks = {
    minLength: PASSWORD_PATTERNS.minLength.test(password),
    hasUpperCase: PASSWORD_PATTERNS.hasUpperCase.test(password),
    hasLowerCase: PASSWORD_PATTERNS.hasLowerCase.test(password),
    hasNumber: PASSWORD_PATTERNS.hasNumber.test(password),
    hasSpecialChar: PASSWORD_PATTERNS.hasSpecialChar.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const strength = (passedChecks / 5) * 100;

  return {
    ...checks,
    strength,
    isValid: passedChecks === 5,
  };
};
