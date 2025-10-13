import { Alert, Button, CircularProgress, Link } from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { MyTextInput } from "../../atoms";
import { login } from "../../../services/auth.service";
import { userService } from "../../../services/user.service";
import { decodeUserIdByToken } from "../../../utils/decodeIdByToken";
import { useRouter } from "next/router";
import { UserContext } from "../../../context/user";

type FormData = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const t = useTranslations("Login");
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onLoginUser = async ({ email, password }: FormData) => {
    setIsLoading(true);
    setShowError(false);

    const token = await login(email, password);

    if (!token) {
      setShowError(true);
      return;
    }

    try {
      const userId = decodeUserIdByToken(token);
      const user = await userService.getUserById(userId);
      if (user) {
        setUser(user);
        router.push("/home");
      }
    } catch (error) {
      console.log("Invalid credentials");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={onLoginUser}
      validationSchema={Yup.object({
        email: Yup.string().email(t("emailError")).required(t("requiredError")),
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
          {showError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {"Invalid credentials"}
            </Alert>
          )}
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

          <Button variant="contained" type="submit" disabled={isLoading} sx={{
            marginBottom: "20px",
          }}>
            {isLoading ? <CircularProgress size={24} /> : t("submit-button")}
          </Button>

          <NextLink href={"/auth/register"} passHref>
            <Link mt={3} component="span">
              {t("existing-account")}
            </Link>
          </NextLink>
        </Form>
      )}
    </Formik>
  );
};
