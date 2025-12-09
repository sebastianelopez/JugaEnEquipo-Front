import React, { useEffect, useState } from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import { useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SuccessSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  severity?: "success" | "error" | "info" | "warning";
  autoHideDuration?: number;
}

export const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  open,
  message,
  onClose,
  severity = "success",
  autoHideDuration = 5000,
}) => {
  const theme = useTheme();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          minWidth: 300,
          maxWidth: 400,
          width: "100%",
          backgroundColor:
            severity === "success"
              ? theme.palette.mode === "dark"
                ? "rgba(46, 125, 50, 0.15)"
                : "rgba(76, 175, 80, 0.1)"
              : severity === "error"
              ? theme.palette.mode === "dark"
                ? "rgba(211, 47, 47, 0.15)"
                : "rgba(244, 67, 54, 0.1)"
              : theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${
            severity === "success"
              ? theme.palette.success.main
              : severity === "error"
              ? theme.palette.error.main
              : theme.palette.primary.main
          }`,
          boxShadow: theme.shadows[4],
          "& .MuiAlert-message": {
            width: "100%",
            padding: 0,
            color: theme.palette.text.primary,
          },
          "& .MuiAlert-action": {
            padding: 0,
            marginRight: 0,
            color: theme.palette.text.primary,
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            sx={{ padding: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
