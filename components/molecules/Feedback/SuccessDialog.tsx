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
  closeLabel?: string;
  lottieSrc?: string;
  lottieLoop?: boolean;
  lottieAutoplay?: boolean;
}

export const SuccessDialog: FC<Props> = ({
  open,
  title = "Operación exitosa",
  message = "La acción se completó correctamente.",
  onClose,
  closeLabel = "Cerrar",
  lottieSrc = "/assets/lotties/success-animation.lottie",
  lottieLoop = false,
  lottieAutoplay = false,
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
