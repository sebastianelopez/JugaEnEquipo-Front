import { Button, Link } from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import * as Yup from "yup";
import { MyCheckbox,  MyTextInput } from "../../atoms";

export const LoginForm = () => {
  const t = useTranslations("Login");

  return (
    <Formik
      initialValues={{        
        email: "",
        password: ""        
      }}
      onSubmit={(values) => {}}
      validationSchema={Yup.object({        
        email: Yup.string()
          .email(t("emailError"))
          .required(t("requiredError")),
        password: Yup.string().required(t("requiredError")),        
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
            label={t("email")}
            name={"email"}
            type="text"
            placeholder={t("emailPlaceholder")}
            style={{
              marginBottom: "20px",
            }}
          />

          <MyTextInput
            type="password"
            label={t("password")}
            name={"password"}
            placeholder={"********"}
            style={{
              marginBottom: "20px",
            }}
          />
         
          <Button type="submit">{t("submit-button")}</Button>

          <NextLink href={"/auth/register"} passHref>
            <Link mt={3}>
              {t("existing-account")}
            </Link>
          </NextLink>
        </Form>
      )}
    </Formik>
  );
};
