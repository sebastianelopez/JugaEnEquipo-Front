import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Email,
  Lock,
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import Image from "next/image";
import NextLink from "next/link";
import { useContext, useState } from "react";
import * as Yup from "yup";
import logo from "../../../assets/logo.png";
import { loginSafe, logout } from "../../../services/auth.service";
import { userService } from "../../../services/user.service";
import { decodeUserIdByToken } from "../../../utils/decodeIdByToken";
import { useRouter } from "next/router";
import { UserContext } from "../../../context/user";

type FormData = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const theme = useTheme();
  const t = useTranslations("Login");
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLoginUser = async (
    { email, password }: FormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setIsLoading(true);
    setShowError(false);
    setSubmitting(true);

    logout();

    try {
      const result = await loginSafe(email, password);

      if (!result.ok || !result.data) {
        const errorMsg =
          result.ok === false ? result.errorMessage : "Unknown error";
        console.error("Login failed:", errorMsg);
        setShowError(true);
        setIsLoading(false);
        setSubmitting(false);
        return;
      }

      const token = result.data;

      // Small delay to ensure cookies are set before making next request

      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const userId = decodeUserIdByToken(token);
        const user = await userService.getUserById(userId);

        if (user) {
          setUser(user);

          router.push("/home");
        } else {
          setShowError(true);
          setIsLoading(false);
          setSubmitting(false);
        }
      } catch (userError: any) {
        console.error("Error fetching user:", userError);
        // If it's a 401 error, the token might not be set yet, try once more
        if (userError?.response?.status === 401) {
          // Wait a bit more and retry once
          await new Promise((resolve) => setTimeout(resolve, 200));
          try {
            const userId = decodeUserIdByToken(token);
            const user = await userService.getUserById(userId);
            if (user) {
              setUser(user);
              router.push("/home");
              return;
            }
          } catch (retryError) {
            console.error("Retry failed:", retryError);
          }
        }
        setShowError(true);
        setIsLoading(false);
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
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
            {t("welcomeBack")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
            {t("invalidCredentials")}
          </Alert>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={onLoginUser}
          validationSchema={Yup.object({
            email: Yup.string()
              .email(t("emailError"))
              .required(t("requiredError")),
            password: Yup.string().required(t("requiredError")),
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
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
                    <LoginIcon />
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
                {isLoading ? t("submitting") : t("submit-button")}
              </Button>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <NextLink href="/auth/forgot-password" passHref>
                  <Link
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      textDecoration: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      "&:hover": {
                        textDecoration: "underline",
                        color: theme.palette.info.main,
                      },
                    }}
                  >
                    {t("forgotPasswordLink")}
                  </Link>
                </NextLink>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                >
                  {t("noAccountQuestion")}{" "}
                </Typography>
                <NextLink href="/auth/register" passHref>
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
                    {t("registerLink")}
                  </Link>
                </NextLink>
              </Box>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
