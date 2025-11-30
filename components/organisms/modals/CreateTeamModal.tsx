import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { TeamForm } from "../../molecules/Form/TeamForm";
import { teamService } from "../../../services/team.service";
import { useFeedback } from "../../../hooks/useFeedback";
import { useTranslations } from "next-intl";

interface CreateTeamPayload {
  name: string;
  description?: string;
  image?: string;
}

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreateTeamModal: FC<CreateTeamModalProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { showError, showSuccess } = useFeedback();
  const t = useTranslations("Teams");

  const handleSubmit = async (values: CreateTeamPayload) => {
    setSubmitting(true);
    const result = await teamService.create(values);
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
        <TeamForm onSubmit={handleSubmit} submitting={submitting} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

