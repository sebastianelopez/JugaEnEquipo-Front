import { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { tournamentService } from "../../../services/tournament.service";
import type { Team } from "../../../interfaces";
import { useFeedback } from "../../../hooks/useFeedback";
import { useTranslations } from "next-intl";

interface SetFinalPositionsModalProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  teams: Team[];
  onSuccess?: () => void;
}

export const SetFinalPositionsModal: FC<SetFinalPositionsModalProps> = ({
  open,
  onClose,
  tournamentId,
  teams,
  onSuccess,
}) => {
  const [firstPlaceTeamId, setFirstPlaceTeamId] = useState<string>("");
  const [secondPlaceTeamId, setSecondPlaceTeamId] = useState<string>("");
  const [thirdPlaceTeamId, setThirdPlaceTeamId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { showError, showSuccess } = useFeedback();
  const t = useTranslations("Tournaments");
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      const loadCurrentPositions = async () => {
        try {
          const result = await tournamentService.find(tournamentId);
          if (result.ok && result.data) {
            const tournament = result.data as any;
            setFirstPlaceTeamId(tournament.firstPlaceTeamId || "");
            setSecondPlaceTeamId(tournament.secondPlaceTeamId || "");
            setThirdPlaceTeamId(tournament.thirdPlaceTeamId || "");
          }
        } catch (error) {
          console.error("Error loading current positions:", error);
          setFirstPlaceTeamId("");
          setSecondPlaceTeamId("");
          setThirdPlaceTeamId("");
        }
      };
      loadCurrentPositions();
    }
  }, [open, tournamentId]);

  const getAvailableTeamsForFirstPlace = () => {
    return teams.filter(
      (team) => team.id !== secondPlaceTeamId && team.id !== thirdPlaceTeamId
    );
  };

  const getAvailableTeamsForSecondPlace = () => {
    return teams.filter(
      (team) => team.id !== firstPlaceTeamId && team.id !== thirdPlaceTeamId
    );
  };

  const getAvailableTeamsForThirdPlace = () => {
    return teams.filter(
      (team) => team.id !== firstPlaceTeamId && team.id !== secondPlaceTeamId
    );
  };

  const handleSubmit = async () => {
    if (!firstPlaceTeamId || !secondPlaceTeamId || !thirdPlaceTeamId) {
      showError({
        title: t("detail.setPositionsError") || "Error",
        message: t("detail.selectAllPositions") || "Debes seleccionar los tres equipos",
      });
      return;
    }

    if (
      firstPlaceTeamId === secondPlaceTeamId ||
      firstPlaceTeamId === thirdPlaceTeamId ||
      secondPlaceTeamId === thirdPlaceTeamId
    ) {
      showError({
        title: t("detail.setPositionsError") || "Error",
        message: t("detail.uniqueTeamsRequired") || "Cada posición debe tener un equipo diferente",
      });
      return;
    }

    setSubmitting(true);

    try {
      const result = await tournamentService.setFinalPositions(tournamentId, {
        firstPlaceTeamId,
        secondPlaceTeamId,
        thirdPlaceTeamId,
      });

      if (result.ok) {
        showSuccess({
          title: t("detail.setPositionsSuccess") || "Éxito",
          message: t("detail.positionsSetSuccessfully") || "Posiciones definidas correctamente",
        });
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        showError({
          title: t("detail.setPositionsError") || "Error",
          message: result.errorMessage || t("detail.setPositionsErrorMessage") || "Error al establecer las posiciones",
        });
      }
    } catch (err: any) {
      showError({
        title: t("detail.setPositionsError") || "Error",
        message: err.message || t("detail.setPositionsErrorMessage") || "Error al establecer las posiciones",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <EmojiEventsIcon sx={{ color: theme.palette.warning.main }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("detail.setFinalPositions") || "Establecer Posiciones Finales"}
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Alert severity="info">
            {t("detail.setPositionsInfo") || "Selecciona los equipos que ocuparon el primer, segundo y tercer lugar del torneo."}
          </Alert>

          <FormControl fullWidth>
            <InputLabel>{t("detail.firstPlace") || "Primer Lugar"}</InputLabel>
            <Select
              value={firstPlaceTeamId}
              onChange={(e) => setFirstPlaceTeamId(e.target.value)}
              label={t("detail.firstPlace") || "Primer Lugar"}
              disabled={submitting}
            >
              {getAvailableTeamsForFirstPlace().map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t("detail.secondPlace") || "Segundo Lugar"}</InputLabel>
            <Select
              value={secondPlaceTeamId}
              onChange={(e) => setSecondPlaceTeamId(e.target.value)}
              label={t("detail.secondPlace") || "Segundo Lugar"}
              disabled={submitting}
            >
              {getAvailableTeamsForSecondPlace().map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t("detail.thirdPlace") || "Tercer Lugar"}</InputLabel>
            <Select
              value={thirdPlaceTeamId}
              onChange={(e) => setThirdPlaceTeamId(e.target.value)}
              label={t("detail.thirdPlace") || "Tercer Lugar"}
              disabled={submitting}
            >
              {getAvailableTeamsForThirdPlace().map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} disabled={submitting} variant="outlined">
          {t("detail.cancel") || "Cancelar"}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !firstPlaceTeamId || !secondPlaceTeamId || !thirdPlaceTeamId}
          variant="contained"
          sx={{
            bgcolor: theme.palette.warning.main,
            "&:hover": {
              bgcolor: theme.palette.warning.dark,
            },
          }}
        >
          {submitting
            ? t("detail.settingPositions") || "Estableciendo..."
            : t("detail.setPositions") || "Establecer Posiciones"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

