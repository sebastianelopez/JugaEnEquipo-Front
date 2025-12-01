import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import logo from "../../../assets/logo.png";
import { resetPassword } from "../../../services/auth.service";
import {
  passwordValidationSchema,
  confirmPasswordValidationSchema,
  checkPasswordStrength,
} from "../../../utils/passwordValidation";

type FormData = {
  password: string;
  passwordConfirmation: string;
};

interface ResetPasswordFormProps {
  token: string;
}

const PasswordRequirement = ({
  met,
  text,
  theme,
}: {
  met: boolean;
  text: string;
  theme: any;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
    {met ? (
      <CheckCircle sx={{ fontSize: 16, color: theme.palette.success.main }} />
    ) : (
      <Cancel sx={{ fontSize: 16, color: theme.palette.error.main }} />
    )}
    <Typography
      variant="caption"
      sx={{
        color: met ? theme.palette.success.main : theme.palette.text.secondary,
      }}
    >
      {text}
    </Typography>
  </Box>
);

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const theme = useTheme();
  const t = useTranslations("ResetPassword");
  const tValidation = useTranslations("Validation");
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const onSubmit = async (
    { password, passwordConfirmation }: FormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setIsLoading(true);
    setShowError(false);
    setShowSuccess(false);
    setSubmitting(true);

    try {
      const result = await resetPassword(token, password, passwordConfirmation);

      if (!result.ok) {
        // Check if error message indicates expired token
        const errorMsg = result.errorMessage || t("errorMessage");
        const isExpiredToken =
          errorMsg.toLowerCase().includes("expired") ||
          errorMsg.toLowerCase().includes("expirado") ||
          errorMsg.toLowerCase().includes("expirado") ||
          errorMsg.toLowerCase().includes("invalid token") ||
          errorMsg.toLowerCase().includes("token inválido");

        setErrorMessage(isExpiredToken ? t("tokenExpiredError") : errorMsg);
        setShowError(true);
        setIsLoading(false);
        setSubmitting(false);
        return;
      }

      setShowSuccess(true);
      setIsLoading(false);
      setSubmitting(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      setErrorMessage(t("errorMessage"));
      setShowError(true);
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const validationSchema = useMemo(
    () =>
      Yup.object({
        password: passwordValidationSchema(tValidation),
        passwordConfirmation: confirmPasswordValidationSchema(
          tValidation,
          "password"
        ),
      }),
    [tValidation]
  );

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

        {!showSuccess && !showError && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
            }}
          >
            {t("expirationInfo")}
          </Alert>
        )}

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
          <Alert
            severity="success"
            icon={<CheckCircle />}
            sx={{
              mb: 3,
            }}
          >
            {t("successMessage")}
          </Alert>
        )}

        {!showSuccess ? (
          <Formik
            initialValues={{
              password: "",
              passwordConfirmation: "",
            }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {(formik) => {
              const passwordStrength = checkPasswordStrength(
                formik.values.password
              );

              return (
                <Form>
                  <Box>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label={t("password")}
                      type={showPassword ? "text" : "password"}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      helperText={
                        formik.touched.password && formik.errors.password
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 0,
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
                    <Collapse
                      in={Boolean(formik.values.password)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box
                        sx={{
                          mt: 2,
                          mb: 3,
                          p: 2,
                          borderRadius: 2,
                          background: alpha(theme.palette.primary.main, 0.1),
                          border: `1px solid ${alpha(
                            theme.palette.primary.main,
                            0.2
                          )}`,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            mb: 1,
                            display: "block",
                          }}
                        >
                          {tValidation("passwordRequirements")}
                        </Typography>
                        <PasswordRequirement
                          met={passwordStrength.minLength}
                          text={tValidation("minLength")}
                          theme={theme}
                        />
                        <PasswordRequirement
                          met={passwordStrength.hasUpperCase}
                          text={tValidation("hasUpperCase")}
                          theme={theme}
                        />
                        <PasswordRequirement
                          met={passwordStrength.hasLowerCase}
                          text={tValidation("hasLowerCase")}
                          theme={theme}
                        />
                        <PasswordRequirement
                          met={passwordStrength.hasNumber}
                          text={tValidation("hasNumber")}
                          theme={theme}
                        />
                        <PasswordRequirement
                          met={passwordStrength.hasSpecialChar}
                          text={tValidation("hasSpecialChar")}
                          theme={theme}
                        />
                      </Box>
                    </Collapse>
                  </Box>

                  <TextField
                    fullWidth
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    label={t("passwordConfirmation")}
                    type={showPasswordConfirmation ? "text" : "password"}
                    value={formik.values.passwordConfirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.passwordConfirmation &&
                      Boolean(formik.errors.passwordConfirmation)
                    }
                    helperText={
                      formik.touched.passwordConfirmation &&
                      formik.errors.passwordConfirmation
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPasswordConfirmation(
                                !showPasswordConfirmation
                              )
                            }
                            edge="end"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {showPasswordConfirmation ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
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
                        <CheckCircle />
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
                </Form>
              );
            }}
          </Formik>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("redirectingMessage")}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
