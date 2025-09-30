import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Box, Button, Typography } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { FC, ReactNode, useEffect } from "react";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
  icon?: ReactNode;
  lottieSrc?: string;
}

export const ErrorState: FC<Props> = ({
  title = "Algo salió mal",
  message = "No pudimos cargar la información. Intenta nuevamente.",
  onRetry,
  actionLabel = "Reintentar",
  icon,
  lottieSrc = "/assets/lotties/error-fail-animation.lottie",
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        maxWidth: 530,
        minHeight: 220,
        border: "1px dashed",
        borderColor: "error.light",
        borderRadius: 2,
        mt: 4,
        p: 3,
        textAlign: "center",
        background: (theme: Theme) =>
          theme.palette.mode === "dark"
            ? "rgba(244, 67, 54, 0.06)"
            : "rgba(244, 67, 54, 0.03)",
      }}
    >
      <Box sx={{ mb: 1 }}>
        {icon || (
          <Box component="div" sx={{ width: 80, height: 80 }}>
            <DotLottieReact src={lottieSrc} loop autoplay />
          </Box>
        )}
      </Box>
      <Typography variant="h6" color="error.main" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
