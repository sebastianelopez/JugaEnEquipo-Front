import { Button, Link, Box, Collapse } from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import * as Yup from "yup";
import { MyTextInput } from "../../atoms";
import {
  passwordValidationSchema,
  confirmPasswordValidationSchema,
  checkPasswordStrength,
} from "../../../utils/passwordValidation";
import { PasswordRequirements } from "../../molecules/Form/PasswordRequirements";
import { useMemo } from "react";
import { userService } from "../../../services/user.service";
import { useFeedback } from "../../../hooks/useFeedback";
import { loginSafe } from "../../../services/auth.service";
import { useRouter } from "next/router";
import {
  firstNameValidationSchema,
  lastNameValidationSchema,
  emailValidationSchema,
  usernameValidationSchema,
} from "../../../utils/fieldValidations";

export const RegisterForm = () => {
  const t = useTranslations("Register");
  const tValidation = useTranslations("Validation");
  const { showError, showSuccess } = useFeedback();
  const router = useRouter();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        firstName: firstNameValidationSchema(tValidation),
        lastName: lastNameValidationSchema(tValidation),
        username: usernameValidationSchema(tValidation),
        email: emailValidationSchema(tValidation),
        password: passwordValidationSchema(tValidation),
        password2: confirmPasswordValidationSchema(tValidation, "password"),
      }),
    [tValidation]
  );

  const handleSubmit = async (values: any) => {
    const payload = {
      firstname: values.firstName,
      lastname: values.lastName,
      username: values.username,
      email: values.email,
      password: values.password,
      confirmationPassword: values.password2,
    };

    const createResult = await userService.createUser(payload);
    if (!createResult.ok) {
      showError({
        title: t("errorTitle", { default: "Error al registrarse" }),
        message:
          createResult.errorMessage ||
          t("errorMessage", { default: "No se pudo crear la cuenta" }),
      });
      return;
    }

    const loginResult = await loginSafe(values.email, values.password);
    if (loginResult.ok) {
      showSuccess({
        title: t("successTitle", { default: "Registro exitoso" }),
        message: t("successMessage", {
          default:
            "Tu cuenta fue creada correctamente. Te estamos redirigiendo a la home...",
        }),
        closeLabel: t("closeLabel", { default: "Cerrar" }),
      });
      router.push("/home");
    } else {
      showError({
        title: t("loginErrorTitle", { default: "Error al iniciar sesión" }),
        message:
          loginResult.errorMessage ||
          t("loginErrorMessage", {
            default: "Tu cuenta fue creada, pero no pudimos iniciar sesión.",
          }),
      });
      router.push("/auth/login");
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        password2: "",
        email: "",
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {(formik) => {
        const passwordStrength = useMemo(
          () => checkPasswordStrength(formik.values.password),
          [formik.values.password]
        );

        return (
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              width: "400px",
            }}
          >
            <MyTextInput
              label={t("name")}
              name="firstName"
              placeholder={t("name")}
            />

            <MyTextInput
              label={t("lastname")}
              name="lastName"
              placeholder={t("lastname")}
            />

            <MyTextInput
              label={t("username")}
              name="username"
              placeholder={t("username")}
            />

            <MyTextInput
              label={t("email")}
              name="email"
              type="email"
              placeholder={t("email")}
            />

            <Box>
              <MyTextInput
                type="password"
                label={t("password")}
                name="password"
                placeholder={t("password")}
                onlyShowRequiredError
                style={{
                  display: "block",
                }}
              />
              <Collapse
                in={Boolean(formik.values.password)}
                timeout="auto"
                unmountOnExit
              >
                <PasswordRequirements
                  rules={{
                    minLength: passwordStrength.minLength,
                    hasUpperCase: passwordStrength.hasUpperCase,
                    hasLowerCase: passwordStrength.hasLowerCase,
                    hasNumber: passwordStrength.hasNumber,
                    hasSpecialChar: passwordStrength.hasSpecialChar,
                  }}
                  show={true}
                />
              </Collapse>
            </Box>

            <MyTextInput
              type="password"
              label={t("repeat-password")}
              name="password2"
              placeholder={t("repeat-password")}
            />

            <Button
              variant="contained"
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              sx={{
                marginBlock: "20px",
              }}
            >
              {t("submit-button")}
            </Button>

            <NextLink href="/auth/login" passHref>
              <Link mt={3} component="span">
                {t("existing-account")}
              </Link>
            </NextLink>
          </Form>
        );
      }}
    </Formik>
  );
};
