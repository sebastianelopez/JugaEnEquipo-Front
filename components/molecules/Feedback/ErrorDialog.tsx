import {
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
}

export const ErrorDialog: FC<Props> = ({
  open,
  title = "Ocurrió un error",
  message = "Inténtalo nuevamente en unos instantes.",
  onClose,
  onRetry,
  retryLabel = "Reintentar",
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
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
