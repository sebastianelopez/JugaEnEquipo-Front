import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#c62400",
    },
    secondary: {
      main: "#df340f",
    },
    info: {
      main: "#ff7b5e",
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: "fixed",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#df340f",
          height: 60,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          // Color for AppBar icons
          "&.MuiAppBar-root &": {
            color: "#fff8f7",
          },
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          // Color for AppBar icons
          ".MuiAppBar-root &": {
            color: "#fff8f7",
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 30,
          fontWeight: 600,
        },
        h2: {
          fontSize: 20,
          fontWeight: 400,
        },
        subtitle1: {
          fontSize: 18,
          fontWeight: 600,
        },
      },
    },

    MuiButton: {
      defaultProps: {
        variant: "contained",
        size: "small",
        disableElevation: true,
        color: "secondary",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          borderRadius: 10,
          ":hover": {
            backgroundColor: "rgba(0,0,0,0.05)",
            transition: "all 0.3s ease-in-out",
          },
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: "0px 5px 5px rgba(0,0,0,0.05)",
          borderRadius: "10px",
        },
      },
    },
  },
});
