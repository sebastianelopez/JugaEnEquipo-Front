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
  alpha,
  useMediaQuery,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PhotoCamera } from "@mui/icons-material";
import { TournamentForm } from "../../molecules/Form/TournamentForm";
import { tournamentService } from "../../../services/tournament.service";
import type { CreateTournamentPayload, Tournament } from "../../../interfaces";
import { useFeedback } from "../../../hooks/useFeedback";
import { useTranslations } from "next-intl";
import { fileToBase64 } from "../../../utils/imageFileUtils";

interface EditTournamentModalProps {
  open: boolean;
  onClose: () => void;
  tournament: Tournament | null;
  onUpdated?: () => void;
}

export const EditTournamentModal: FC<EditTournamentModalProps> = ({
  open,
  onClose,
  tournament,
  onUpdated,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const { showError, showSuccess } = useFeedback();
  const t = useTranslations("Tournaments");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (open && tournament?.id) {
      const loadBackgroundImage = async () => {
        try {
          const result = await tournamentService.getBackgroundImage(tournament.id);
          if (result.ok && result.data) {
            setBackgroundImage(result.data);
          } else {
            setBackgroundImage(null);
          }
        } catch (error) {
          console.error("Error loading background image:", error);
          setBackgroundImage(null);
        }
      };
      loadBackgroundImage();
    } else {
      setBackgroundImage(null);
      setBackgroundImageFile(null);
    }
  }, [open, tournament?.id]);

  const handleBackgroundImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setBackgroundImage(base64);
      setBackgroundImageFile(file);
    } catch (error) {
      console.error("Error processing background image:", error);
      showError({
        title: t("errorTitle") || "Error",
        message: t("errorProcessingImage") || "Error al procesar la imagen",
      });
    }
  };

  const handleSubmit = async (values: CreateTournamentPayload) => {
    if (!tournament) return;

    setSubmitting(true);
    
    try {
      // Update tournament data (image is always null for updates)
      const updatePayload: CreateTournamentPayload = {
        ...values,
        image: null, // Always null for updates
      };

      const result = await tournamentService.create(tournament.id, updatePayload);
      
      if (!result.ok) {
        showError({
          title: t("errorTitle") || "Error",
          message: result.errorMessage || t("updateError") || "Error al actualizar el torneo",
        });
        setSubmitting(false);
        return;
      }

      // Update background image if changed
      if (backgroundImageFile) {
        const bgResult = await tournamentService.updateBackgroundImage(
          tournament.id,
          backgroundImage || ""
        );
        
        if (!bgResult.ok) {
          showError({
            title: t("errorTitle") || "Error",
            message: bgResult.errorMessage || t("updateBackgroundError") || "Error al actualizar la imagen de fondo",
          });
          setSubmitting(false);
          return;
        }
      }

      showSuccess({
        title: t("successTitle") || "Éxito",
        message: t("updateSuccess") || "Torneo actualizado exitosamente",
      });
      onClose();
      onUpdated?.();
    } catch (error: any) {
      showError({
        title: t("errorTitle") || "Error",
        message: error.message || t("updateError") || "Error al actualizar el torneo",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!tournament) return null;

  const initialValues: Partial<CreateTournamentPayload> = {
    gameId: tournament.gameId,
    responsibleId: tournament.responsibleId,
    name: tournament.name,
    description: tournament.description,
    maxTeams: tournament.maxTeams,
    isOfficial: tournament.isOfficial,
    image: null, // Always null for updates
    prize: tournament.prize,
    region: tournament.region,
    startAt: tournament.startAt,
    endAt: tournament.endAt,
    minGameRankId: tournament.minGameRankId || null,
    maxGameRankId: tournament.maxGameRankId || null,
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
        {t("editTournament") || "Editar Torneo"}
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
        <Stack spacing={3}>
          <TournamentForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitButtonText={t("updateTournament") || "Actualizar Torneo"}
          />

          {/* Background Image Upload */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              {t("backgroundImage") || "Imagen de Fondo"}
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 200,
                borderRadius: 2,
                overflow: "hidden",
                border: `2px dashed ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: theme.palette.action.hover,
                cursor: "pointer",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {backgroundImage ? (
                <Box
                  component="img"
                  src={backgroundImage}
                  alt="Background preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Stack spacing={1} alignItems="center">
                  <PhotoCamera sx={{ fontSize: 48, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {t("uploadBackgroundImage") || "Subir imagen de fondo"}
                  </Typography>
                </Stack>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>
        </Stack>
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
          disabled={submitting}
          sx={{
            fontSize: { xs: "0.875rem", md: "1rem" },
            py: { xs: 1.25, md: 0.75 },
          }}
        >
          {t("cancel") || "Cancelar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

