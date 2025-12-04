"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Lock,
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from "@mui/icons-material";
import { Form, Formik } from "formik";

import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from "yup";
import { backofficeService } from "../../../services/backoffice.service";
import Cookies from "js-cookie";
import { getAuthCookieOptions } from "../../../utils/cookies";
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";

type FormData = {
  user: string;
  password: string;
};

export default function AdminLoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations("Admin.login");
  const tCommon = useTranslations("Admin.common");

  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onLoginAdmin = async (
    { user, password }: FormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setIsLoading(true);
    setShowError(false);
    setSubmitting(true);
    setErrorMessage("");

    try {
      const result = await backofficeService.login(user, password);

      if (!result.ok || !result.data) {
        const errorMsg =
          result.ok === false ? result.errorMessage : "Unknown error";
        console.error("Login failed:", errorMsg);
        
        // Log response details if available
        if (!result.ok && result.error && (result.error as any).response) {
          const axiosError = result.error as any;
          console.error("Response status:", axiosError.response?.status);
          console.error("Response data:", axiosError.response?.data);
        }
        
        setErrorMessage(errorMsg || t("error"));
        setShowError(true);
        setIsLoading(false);
        setSubmitting(false);
        return;
      }

      const { token, refreshToken } = result.data;

      if (!token) {
        setErrorMessage(t("error"));
        setShowError(true);
        setIsLoading(false);
        setSubmitting(false);
        return;
      }

      // Store tokens in cookies
      const cookieOptions = getAuthCookieOptions();
      Cookies.set("token", token, cookieOptions);
      if (refreshToken) {
        Cookies.set("refreshToken", refreshToken, cookieOptions);
      }

      // Store admin token in localStorage for admin panel check
      localStorage.setItem("adminToken", token);

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error?.message || t("loginFailed"));
      setShowError(true);
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1A1A2E 0%, #2D3436 100%)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.3)}`,
          background: alpha("#2D3436", 0.95),
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
                background: "linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 40, color: "#fff" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              {t("title")}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              {t("subtitle")}
            </Typography>
          </Box>

          {showError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(225, 112, 85, 0.1)",
                color: "#E17055",
                border: "1px solid rgba(225, 112, 85, 0.3)",
              }}
            >
              {errorMessage || t("loginFailed")}
            </Alert>
          )}

          <Formik
            initialValues={{
              user: "",
              password: "",
            }}
            onSubmit={onLoginAdmin}
            validationSchema={Yup.object({
              user: Yup.string().required(t("username") + " is required"),
              password: Yup.string().required(t("password") + " is required"),
            })}
          >
            {(formik) => (
              <Form>
                <TextField
                  fullWidth
                  id="user"
                  name="user"
                  label={t("username")}
                  value={formik.values.user}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.user && Boolean(formik.errors.user)}
                  helperText={formik.touched.user && formik.errors.user}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AdminPanelSettings
                          sx={{ color: "rgba(255,255,255,0.7)" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#6C5CE7",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#6C5CE7",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "rgba(255, 255, 255, 0.5)",
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
                        <Lock sx={{ color: "rgba(255,255,255,0.7)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#6C5CE7",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#6C5CE7",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "rgba(255, 255, 255, 0.5)",
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
                    background:
                      "linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5B4BCF 0%, #00B8B1 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 20px ${alpha("#6C5CE7", 0.4)}`,
                    },
                    "&:disabled": {
                      background: alpha("#6C5CE7", 0.3),
                    },
                  }}
                >
                  {isLoading ? tCommon("loading") : t("loginButton")}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../../lang/${locale}.json`)).default,
    },
  };
}
