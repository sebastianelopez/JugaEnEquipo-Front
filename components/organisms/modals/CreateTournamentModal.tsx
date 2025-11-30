import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  useTheme,
  alpha,
  useMediaQuery,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TournamentForm } from "../../molecules/Form/TournamentForm";
import { tournamentService } from "../../../services/tournament.service";
import type { CreateTournamentPayload } from "../../../interfaces";
import { useFeedback } from "../../../hooks/useFeedback";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";

interface CreateTournamentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreateTournamentModal: FC<CreateTournamentModalProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { showError, showSuccess } = useFeedback();
  const t = useTranslations("Tournaments");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSubmit = async (values: CreateTournamentPayload) => {
    setSubmitting(true);
    const tournamentId = uuidv4();
    const result = await tournamentService.create(tournamentId, values);
    setSubmitting(false);
    if (!result.ok) {
      showError({
        title: t("errorTitle"),
        message: result.errorMessage,
      });
      return;
    }
    showSuccess({
      title: t("successTitle"),
      message: t("successMessage"),
    });
    onClose();
    onCreated?.();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", md: "center" },
        },
      }}
      PaperProps={{
        sx: {
          m: { xs: 0, md: 2 },
          borderRadius: { xs: "16px 16px 0 0", md: 2 },
          maxHeight: { xs: "90vh", md: "90vh" },
          height: { xs: "auto", md: "auto" },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: { xs: 1, md: 2 },
          fontSize: { xs: "1.1rem", md: "1.25rem" },
        }}
      >
        {t("modalTitle")}
        {isMobile && (
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent 
        dividers
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          overflowY: "auto",
        }}
      >
        <TournamentForm onSubmit={handleSubmit} submitting={submitting} />
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 1.5 },
          flexDirection: { xs: "column-reverse", md: "row" },
          gap: { xs: 1, md: 0 },
          borderTop: { xs: `1px solid ${theme.palette.divider}`, md: "none" },
        }}
      >
        <Button 
          onClick={onClose} 
          color="inherit"
          fullWidth={isMobile}
          sx={{
            fontSize: { xs: "0.875rem", md: "1rem" },
            py: { xs: 1.25, md: 0.75 },
          }}
        >
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
