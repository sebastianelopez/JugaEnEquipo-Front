import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { Email, Send } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import Image from "next/image";
import NextLink from "next/link";
import { useState } from "react";
import * as Yup from "yup";
import logo from "../../../assets/logo.png";
import { forgotPassword } from "../../../services/auth.service";

type FormData = {
  email: string;
};

export const ForgotPasswordForm = () => {
  const theme = useTheme();
  const t = useTranslations("ForgotPassword");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (
    { email }: FormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setIsLoading(true);
    setShowError(false);
    setShowSuccess(false);
    setSubmitting(true);

    try {
      const result = await forgotPassword(email);

      if (!result.ok) {
        setErrorMessage(result.errorMessage || t("errorMessage"));
        setShowError(true);
        setIsLoading(false);
        setSubmitting(false);
        return;
      }

      setShowSuccess(true);
      setIsLoading(false);
      setSubmitting(false);
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrorMessage(t("errorMessage"));
      setShowError(true);
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 500,
        width: "100%",
        borderRadius: 3,
        boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.2)}`,
        background: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: "blur(10px)",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              mb: 2,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "float 3s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-10px)" },
              },
            }}
          >
            <Image
              src={logo}
              alt="Juga en Equipo"
              width={70}
              height={70}
              style={{ borderRadius: "50%" }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            {t("title")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            {t("subtitle")}
          </Typography>
        </Box>

        {showError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              animation: "shake 0.5s",
              "@keyframes shake": {
                "0%, 100%": { transform: "translateX(0)" },
                "25%": { transform: "translateX(-10px)" },
                "75%": { transform: "translateX(10px)" },
              },
            }}
          >
            {errorMessage}
          </Alert>
        )}

        {showSuccess && (
          <>
            <Alert
              severity="success"
              sx={{
                mb: 2,
              }}
            >
              {t("successMessage")}
            </Alert>
            <Alert
              severity="warning"
              sx={{
                mb: 3,
              }}
            >
              {t("expirationWarning")}
            </Alert>
          </>
        )}

        {!showSuccess ? (
          <Formik
            initialValues={{
              email: "",
            }}
            onSubmit={onSubmit}
            validationSchema={Yup.object({
              email: Yup.string()
                .email(t("emailError"))
                .required(t("requiredError")),
            })}
          >
            {(formik) => (
              <Form>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label={t("email")}
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                  }}
                />

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  type="submit"
                  disabled={isLoading || !formik.isValid}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Send />
                    )
                  }
                  sx={{
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: `linear-gradient(135deg, ${
                        theme.palette.primary.dark
                      } 0%, ${
                        theme.palette.info.dark || theme.palette.info.main
                      } 100%)`,
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 20px ${alpha(
                        theme.palette.primary.main,
                        0.4
                      )}`,
                    },
                    "&:disabled": {
                      background: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  {isLoading ? t("submitting") : t("submitButton")}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    {t("rememberPassword")}{" "}
                  </Typography>
                  <NextLink href="/auth/login" passHref>
                    <Link
                      component="span"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        textDecoration: "none",
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                          color: theme.palette.info.main,
                        },
                      }}
                    >
                      {t("backToLogin")}
                    </Link>
                  </NextLink>
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              component={NextLink}
              href="/auth/login"
              sx={{
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                py: 1.5,
                fontSize: "1rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${
                    theme.palette.primary.dark
                  } 0%, ${
                    theme.palette.info.dark || theme.palette.info.main
                  } 100%)`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 20px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                },
              }}
            >
              {t("backToLogin")}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
