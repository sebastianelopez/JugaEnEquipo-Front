import { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { EditTeamForm } from "../../molecules/Form/EditTeamForm";
import { teamService } from "../../../services/team.service";
import { gameService } from "../../../services/game.service";
import { useFeedback } from "../../../hooks/useFeedback";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import { handleImagePreviewChange } from "../../../utils/imageFileUtils";
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
  const theme = useTheme();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [previewBackgroundImage, setPreviewBackgroundImage] = useState<string | null>(null);
  const [initialBackgroundImage, setInitialBackgroundImage] = useState<string | null>(null);

  // Load background image when modal opens
  useEffect(() => {
    const loadBackgroundImage = async () => {
      if (!open || !team?.id) return;
      try {
        const result = await teamService.getBackgroundImage(team.id);
        if (result.ok) {
          const bgImage = result.data;
          setBackgroundImage(bgImage);
          setPreviewBackgroundImage(bgImage);
          setInitialBackgroundImage(bgImage);
        } else {
          setBackgroundImage(null);
          setPreviewBackgroundImage(null);
          setInitialBackgroundImage(null);
        }
      } catch (error) {
        console.error("Error loading background image:", error);
        setBackgroundImage(null);
        setPreviewBackgroundImage(null);
        setInitialBackgroundImage(null);
      }
    };

    loadBackgroundImage();
  }, [open, team?.id]);

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImagePreviewChange(
      e,
      (preview) => {
        setPreviewBackgroundImage(preview);
        setBackgroundImage(preview);
      }
    );
  };

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

      // Update background image if changed
      if (backgroundImage !== initialBackgroundImage) {
        if (backgroundImage) {
          const bgResult = await teamService.updateBackgroundImage(team.id, backgroundImage);
          if (!bgResult.ok) {
            showError({
              title: t("errorTitle") || "Error",
              message: bgResult.errorMessage || "Error al actualizar la imagen de fondo",
            });
          }
        }
        // Note: If backgroundImage is null and initialBackgroundImage was not null,
        // we could delete it, but the API doesn't support deletion yet
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
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            {t("backgroundImage") || "Imagen de fondo"}
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 150,
              borderRadius: 2,
              overflow: "hidden",
              mb: 1,
              border: `2px dashed ${theme.palette.divider}`,
              position: "relative",
              cursor: "pointer",
              "&:hover": {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            {previewBackgroundImage ? (
              <Box
                component="img"
                src={previewBackgroundImage}
                alt="Background preview"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: theme.palette.background.default,
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.875rem",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  {t("backgroundImagePlaceholder") || "Sin imagen de fondo"}
                </Typography>
              </Box>
            )}
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleBackgroundImageChange}
              id="team-background-image-input"
            />
          </Box>
          <Button
            variant="outlined"
            component="label"
            htmlFor="team-background-image-input"
            startIcon={<PhotoCamera />}
            size="small"
            fullWidth
          >
            {t("changeBackground") || "Cambiar imagen de fondo"}
          </Button>
        </Box>
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
