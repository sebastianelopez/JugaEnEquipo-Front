import * as Yup from "yup";

type Translator = (key: string) => string;

export const firstNameValidationSchema = (t: Translator) =>
  Yup.string()
    .min(2, t("firstNameMin"))
    .max(50, t("firstNameMax"))
    .required(t("required"));

export const lastNameValidationSchema = (t: Translator) =>
  Yup.string()
    .min(2, t("lastNameMin"))
    .max(50, t("lastNameMax"))
    .required(t("required"));

export const emailValidationSchema = (t: Translator) =>
  Yup.string().email(t("invalidEmail")).required(t("required"));

export const usernameValidationSchema = (t: Translator) =>
  Yup.string()
    .min(3, t("usernameMin"))
    .max(20, t("usernameMax"))
    .matches(/^[a-zA-Z0-9_\.]+$/, t("usernameInvalid"))
    .required(t("required"));
