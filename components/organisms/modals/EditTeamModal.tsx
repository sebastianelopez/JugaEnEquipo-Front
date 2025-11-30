import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { EditTeamForm } from "../../molecules/Form/EditTeamForm";
import { teamService } from "../../../services/team.service";
import { gameService } from "../../../services/game.service";
import { useFeedback } from "../../../hooks/useFeedback";
import { useTranslations } from "next-intl";
import type { Team, Game } from "../../../interfaces";

interface EditTeamPayload {
  name: string;
  description?: string;
  image?: string;
}

interface EditTeamModalProps {
  open: boolean;
  onClose: () => void;
  team: Team;
  teamGames: Game[];
  onUpdated?: () => void;
}

export const EditTeamModal: FC<EditTeamModalProps> = ({
  open,
  onClose,
  team,
  teamGames,
  onUpdated,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { showError, showSuccess } = useFeedback();
  const t = useTranslations("Teams");

  const handleSubmit = async (
    values: EditTeamPayload,
    selectedGames: string[]
  ) => {
    setSubmitting(true);

    try {
      // Get all available games to get names for error messages
      const allGamesResult: { ok: boolean; data?: Game[] } =
        await gameService.getAllGames();
      const allGames: Game[] =
        allGamesResult.ok && allGamesResult.data ? allGamesResult.data : [];

      const updatePayload: EditTeamPayload = {
        name: values.name,
        description: values.description,
        image:
          values.image && values.image.startsWith("data:image")
            ? values.image
            : undefined,
      };

      const updateResult = await teamService.create(updatePayload, team.id);
      if (!updateResult.ok) {
        showError({
          title: t("errorTitle") || "Error",
          message: updateResult.errorMessage || "Error al actualizar el equipo",
        });
        setSubmitting(false);
        return;
      }

      // Update games
      const currentGameIds = teamGames.map((g) => g.id);
      const gamesToAdd = selectedGames.filter(
        (id) => !currentGameIds.includes(id)
      );
      const gamesToRemove = currentGameIds.filter(
        (id) => !selectedGames.includes(id)
      );

      // Add new games
      const addErrors: string[] = [];
      for (const gameId of gamesToAdd) {
        const addResult = await teamService.addGame(team.id, gameId);
        if (!addResult.ok) {
          const gameName =
            allGames.find((g: Game) => g.id === gameId)?.name || gameId;
          addErrors.push(
            `${gameName}: ${
              (addResult as any).errorMessage || "Error desconocido"
            }`
          );
        }
      }

      // Remove games
      const removeErrors: string[] = [];
      for (const gameId of gamesToRemove) {
        const removeResult = await teamService.deleteGame(team.id, gameId);
        if (!removeResult.ok) {
          const gameName =
            allGames.find((g: Game) => g.id === gameId)?.name || gameId;
          removeErrors.push(
            `${gameName}: ${
              (removeResult as any).errorMessage || "Error desconocido"
            }`
          );
        }
      }

      // Show errors if any
      if (addErrors.length > 0 || removeErrors.length > 0) {
        const errorMessages = [
          ...(addErrors.length > 0
            ? [`Error al agregar juegos:\n${addErrors.join("\n")}`]
            : []),
          ...(removeErrors.length > 0
            ? [`Error al eliminar juegos:\n${removeErrors.join("\n")}`]
            : []),
        ].join("\n\n");

        showError({
          title: t("errorTitle") || "Error",
          message: errorMessages,
        });

        setSubmitting(false);
        return;
      }

      showSuccess({
        title: t("updateSuccessTitle") || "Equipo actualizado",
        message:
          t("updateSuccessMessage") || "El equipo se actualizó correctamente",
      });
      onClose();
      onUpdated?.();
    } catch (error: any) {
      showError({
        title: t("errorTitle") || "Error",
        message: error?.message || "Error al actualizar el equipo",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t("editModalTitle") || "Editar equipo"}</DialogTitle>
      <DialogContent dividers>
        <EditTeamForm
          initialValues={{
            name: team.name,
            description: team.description,
            image: team.image,
          }}
          initialGames={teamGames}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
