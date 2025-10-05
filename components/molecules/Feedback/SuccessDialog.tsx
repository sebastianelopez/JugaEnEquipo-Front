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
  closeLabel?: string;
}

export const SuccessDialog: FC<Props> = ({
  open,
  title = "Operación exitosa",
  message = "La acción se completó correctamente.",
  onClose,
  closeLabel = "Cerrar",
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
        <Button
          type="button"
          onClick={onClose}
          variant="contained"
          color="primary"
        >
          {closeLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
