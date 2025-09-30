import { createTheme, alpha } from "@mui/material/styles";

const colors = {
  primary: "#6C5CE7", // Púrpura gaming
  secondary: "#2D3436", // Gris oscuro
  accent: "#00CEC9", // Turquesa
  warning: "#FDCB6E", // Amarillo suave
  success: "#00B894", // Verde esports
  error: "#E17055", // Rojo suave
  white: "#FFFFFF",
  black: "#000000",
  darkBg: "#1A1A2E", // Fondo oscuro gaming
  lightBg: "#F8F9FA", // Fondo claro
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.primary,
      light: "#8B7ED8",
      dark: "#5A4FCF",
      contrastText: colors.white,
    },
    secondary: {
      main: colors.secondary,
      light: "#636E72",
      dark: "#2D3436",
      contrastText: colors.white,
    },
    background: {
      default: colors.lightBg,
      paper: colors.white,
    },
    text: {
      primary: colors.secondary,
      secondary: "#636E72",
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
    info: {
      main: colors.accent,
    },
  },
  typography: {
    fontFamily: '"Geist Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          boxShadow: `0 4px 12px ${alpha(colors.primary, 0.25)}`,
          ":hover": {
            boxShadow: `0 6px 16px ${alpha(colors.primary, 0.35)}`,
          },
          ":disabled": {
            boxShadow: "none",
            opacity: 0.6,
          },
        },
        outlined: {
          borderWidth: 2,
          ":hover": {
            backgroundColor: alpha(colors.primary, 0.08),
          },
        },
        text: {
          ":hover": {
            backgroundColor: alpha(colors.primary, 0.06),
          },
        },
        sizeSmall: {
          padding: "8px 16px",
          fontSize: "0.875rem",
        },
        sizeMedium: {
          padding: "10px 20px",
          fontSize: "0.95rem",
        },
        sizeLarge: {
          padding: "12px 24px",
          fontSize: "1rem",
        },
        startIcon: {
          marginRight: 8,
          marginLeft: -4,
        },
        endIcon: {
          marginLeft: 8,
          marginRight: -4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(108, 92, 231, 0.1)",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.primary,
      light: "#8B7ED8",
      dark: "#5A4FCF",
      contrastText: colors.white,
    },
    secondary: {
      main: "#636E72",
      light: "#81ECEC",
      dark: colors.secondary,
      contrastText: colors.white,
    },
    background: {
      default: colors.darkBg,
      paper: "#2D3436",
    },
    text: {
      primary: colors.white,
      secondary: "#B2BEC3",
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
    info: {
      main: colors.accent,
    },
  },
  typography: {
    fontFamily: '"Geist Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          boxShadow: `0 6px 18px ${alpha(colors.primary, 0.35)}`,
          ":hover": {
            boxShadow: `0 8px 22px ${alpha(colors.primary, 0.45)}`,
          },
          ":disabled": {
            boxShadow: "none",
            opacity: 0.6,
          },
        },
        outlined: {
          borderWidth: 2,
          ":hover": {
            backgroundColor: alpha(colors.primary, 0.12),
          },
        },
        text: {
          ":hover": {
            backgroundColor: alpha(colors.primary, 0.1),
          },
        },
        sizeSmall: {
          padding: "8px 16px",
          fontSize: "0.875rem",
        },
        sizeMedium: {
          padding: "10px 20px",
          fontSize: "0.95rem",
        },
        sizeLarge: {
          padding: "12px 24px",
          fontSize: "1rem",
        },
        startIcon: {
          marginRight: 8,
          marginLeft: -4,
        },
        endIcon: {
          marginLeft: 8,
          marginRight: -4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          background: "linear-gradient(135deg, #2D3436 0%, #636E72 100%)",
        },
      },
    },
  },
});
