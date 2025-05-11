import { Button, Link } from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import * as Yup from "yup";
import { MyCheckbox, MyTextInput } from "../../atoms";

export const RegisterForm = () => {
  const t = useTranslations("Register");

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        password: "",
        password2: "",
        email: "",
        terms: false,
      }}
      onSubmit={(values) => {}}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .min(2, "El mininimo debe ser de 3 caraacteres")
          .max(15, "El maximo de caracteres es 15")
          .required("Requerido"),
        lastName: Yup.string()
          .min(2, "El mininimo debe ser de 3 caraacteres")
          .max(15, "El maximo de caracteres es 15")
          .required("Requerido"),
        email: Yup.string()
          .email("Revise el formato del correo")
          .required("Requerido"),
        password: Yup.string().min(6, "Minimo 6 letras").required("Requerido"),
        password2: Yup.string()
          .oneOf([Yup.ref("password1")], "Las contraseñasa no son iguales")
          .required("Requerido"),
        terms: Yup.boolean()
          .oneOf([true], "Debe de aceptar las condiciones")
          .required("Requerido"),
      })}
    >
      {(formik) => (
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "400px",
            justifyContent: "space-between",
          }}
        >
          <MyTextInput
            label={t("name")}
            name={"firstName"}
            placeholder={t("name")}
            style={{
              marginBottom: "20px",
            }}
          />

          <MyTextInput
            label={t("lastname")}
            name={"lastName"}
            placeholder={t("lastname")}
            style={{
              marginBottom: "20px",
            }}
          />

          <MyTextInput
            label={t("email")}
            name={"email"}
            type="text"
            placeholder={t("email")}
            style={{
              marginBottom: "20px",
            }}
          />

          <MyTextInput
            type="password"
            label={t("password")}
            name={"password"}
            placeholder={t("password")}
            style={{
              marginBottom: "20px",
            }}
          />

          <MyTextInput
            type="password"
            label={t("repeat-password")}
            name={"password2"}
            placeholder={t("repeat-password")}
            style={{
              marginBottom: "20px",
            }}
          />

          <MyCheckbox
            label={t("terms")}
            name={"terms"}
            style={{
              marginBottom: "20px",
            }}
          />

          <Button type="submit">{t("submit-button")}</Button>

          <NextLink href={"/auth/login"} passHref>
            <Link mt={3} component="span">
              {t("existing-account")}
            </Link>
          </NextLink>
        </Form>
      )}
    </Formik>
  );
};
