import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FC } from "react";

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onRetry?: () => void;
  retryLabel?: string;
  lottieSrc?: string;
  lottieLoop?: boolean;
  lottieAutoplay?: boolean;
}

export const ErrorDialog: FC<Props> = ({
  open,
  title = "Ocurrió un error",
  message = "Inténtalo nuevamente en unos instantes.",
  onClose,
  onRetry,
  retryLabel = "Reintentar",
  lottieSrc = "/assets/lotties/error-fail-animation.lottie",
  lottieLoop = false,
  lottieAutoplay = true,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          component="div"
          sx={{
            width: 40,
            height: 40,
          }}
        >
          <DotLottieReact
            src={lottieSrc}
            loop={lottieLoop}
            autoplay={lottieAutoplay}
          />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            variant="contained"
            color="primary"
          >
            {retryLabel}
          </Button>
        )}
        <Button type="button" onClick={onClose} color="inherit">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
