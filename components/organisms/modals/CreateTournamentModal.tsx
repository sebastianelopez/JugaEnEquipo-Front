import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { TournamentForm } from "../../molecules/Form/TournamentForm";
import { tournamentService } from "../../../services/tournament.service";
import type { CreateTournamentPayload } from "../../../interfaces";
import { useFeedback } from "../../../hooks/useFeedback";
import { useTranslations } from "next-intl";

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

  const handleSubmit = async (values: CreateTournamentPayload) => {
    setSubmitting(true);
    const result = await tournamentService.create(values);
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t("modalTitle")}</DialogTitle>
      <DialogContent dividers>
        <TournamentForm onSubmit={handleSubmit} submitting={submitting} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
