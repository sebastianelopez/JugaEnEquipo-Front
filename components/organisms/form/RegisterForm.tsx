import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Stack,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import * as Yup from "yup";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  AccountCircle,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  passwordValidationSchema,
  confirmPasswordValidationSchema,
  checkPasswordStrength,
} from "../../../utils/passwordValidation";
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
import logo from "../../../assets/logo.png";

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

export const RegisterForm = () => {
  const theme = useTheme();
  const t = useTranslations("Register");
  const tValidation = useTranslations("Validation");
  const { showError, showSuccess } = useFeedback();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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
        title: t("errorTitle"),
        message: createResult.errorMessage || t("errorMessage"),
      });
      return;
    }

    const loginResult = await loginSafe(values.email, values.password);
    if (loginResult.ok) {
      showSuccess({
        title: t("successTitle"),
        message: t("successMessage"),
        closeLabel: t("closeLabel"),
      });
      router.push("/home");
    } else {
      showError({
        title: t("loginErrorTitle"),
        message: loginResult.errorMessage || t("loginErrorMessage"),
      });
      router.push("/auth/login");
    }
  };

  return (
    <Card
      sx={{
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.8)
            : alpha(theme.palette.background.paper, 0.95),
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
        animation: "fadeInUp 0.6s ease-out",
        "@keyframes fadeInUp": {
          from: {
            opacity: 0,
            transform: "translateY(30px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
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
          <Typography variant="body2" color="text.secondary">
            {t("subtitle")}
          </Typography>
        </Box>

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
              <Form>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <TextField
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label={t("name")}
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                      }
                      helperText={
                        formik.touched.firstName && formik.errors.firstName
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person
                              sx={{ color: theme.palette.primary.main }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
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
                      id="lastName"
                      name="lastName"
                      label={t("lastname")}
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                      }
                      helperText={
                        formik.touched.lastName && formik.errors.lastName
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person
                              sx={{ color: theme.palette.primary.main }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
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
                  </Box>

                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label={t("username")}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle
                            sx={{ color: theme.palette.primary.main }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
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
                    id="password2"
                    name="password2"
                    label={t("repeat-password")}
                    type={showPassword2 ? "text" : "password"}
                    value={formik.values.password2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password2 &&
                      Boolean(formik.errors.password2)
                    }
                    helperText={
                      formik.touched.password2 && formik.errors.password2
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
                            onClick={() => setShowPassword2(!showPassword2)}
                            edge="end"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {showPassword2 ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
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
                </Stack>

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                  startIcon={
                    formik.isSubmitting ? <CircularProgress size={20} /> : null
                  }
                  sx={{
                    mt: 3,
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
                  {formik.isSubmitting ? t("submitting") : t("submit-button")}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    {t("existing-account-question")}{" "}
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
                      {t("loginLink")}
                    </Link>
                  </NextLink>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CardContent>
    </Card>
  );
};
