import { FC, useMemo, useState, useEffect, useRef } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Stack,
  Typography,
  Avatar,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { MyTextInput } from "../../atoms";
import { useTranslations } from "next-intl";
import { handleImageFileChange } from "../../../utils/imageFileUtils";
import { gameService } from "../../../services/game.service";
import type { Game } from "../../../interfaces";

interface EditTeamPayload {
  name: string;
  description?: string;
  image?: string;
}

interface EditTeamFormProps {
  initialValues?: Partial<EditTeamPayload>;
  initialGames?: Game[];
  onSubmit: (values: EditTeamPayload, selectedGames: string[]) => Promise<void> | void;
  submitting?: boolean;
}

const ImageWatcher: FC<{
  onImageChange: (image: string | null) => void;
}> = ({ onImageChange }) => {
  const { values } = useFormikContext<EditTeamPayload>();
  const prevImageRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (values.image !== prevImageRef.current) {
      prevImageRef.current = values.image || undefined;
      if (
        values.image &&
        (values.image.startsWith("http") ||
          values.image.startsWith("https") ||
          values.image.startsWith("data:image"))
      ) {
        onImageChange(values.image);
      } else if (!values.image) {
        onImageChange(null);
      }
    }
  }, [values.image, onImageChange]);

  return null;
};

export const EditTeamForm: FC<EditTeamFormProps> = ({
  initialValues,
  initialGames = [],
  onSubmit,
  submitting,
}) => {
  const t = useTranslations("Teams");
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image || null
  );
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [selectedGames, setSelectedGames] = useState<string[]>(
    initialGames.map((g) => g.id)
  );

  useEffect(() => {
    const fetchGames = async () => {
      setLoadingGames(true);
      const result = await gameService.getAllGames();
      if (result.ok && result.data) {
        setAvailableGames(result.data);
      }
      setLoadingGames(false);
    };
    fetchGames();
  }, []);

  useEffect(() => {
    if (initialValues?.image) {
      setImagePreview(initialValues.image);
    }
  }, [initialValues?.image]);

  useEffect(() => {
    setSelectedGames(initialGames.map((g) => g.id));
  }, [initialGames]);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string()
          .required(t("form.nameRequired"))
          .max(80, t("form.nameMaxLength")),
        description: Yup.string().max(500, t("form.descriptionMaxLength")),
        image: Yup.string()
          .nullable()
          .test("image-format", "Image must be a base64 string", (value) => {
            if (!value) return true;
            return /^data:image\//.test(value);
          }),
      }),
    [t]
  );

  const defaultValues: EditTeamPayload = useMemo(() => {
    return {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      image: initialValues?.image || undefined,
    };
  }, [initialValues]);

  const handleSubmit = async (
    values: EditTeamPayload & { image?: string | null; description?: string | null },
    helpers: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const toUndefinedIfEmpty = (value: string | null | undefined): string | undefined => {
      if (!value || (typeof value === "string" && !value.trim())) return undefined;
      return typeof value === "string" ? value.trim() : undefined;
    };

    const payload: EditTeamPayload = {
      name: values.name.trim(),
      description: toUndefinedIfEmpty(values.description),
      image: toUndefinedIfEmpty(values.image),
    };
    await onSubmit(payload, selectedGames);
    console.log("selectedGames", selectedGames);
    console.log("payload", payload);
    helpers.setSubmitting(false);
  };


  return (
    <Formik
      initialValues={defaultValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <ImageWatcher onImageChange={setImagePreview} />
            <Stack spacing={3} sx={{ width: "100%", maxWidth: 600 }}>
              <MyTextInput
                name="name"
                label={t("form.name")}
                placeholder={t("form.namePlaceholder")}
              />
              <MyTextInput
                name="description"
                label={t("form.description")}
                placeholder={t("form.descriptionPlaceholder")}
                multiline
                rows={3}
              />

              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t("form.image")}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  {imagePreview && (
                    <Avatar
                      src={imagePreview}
                      alt="Team preview"
                      sx={{ width: 80, height: 80 }}
                      variant="rounded"
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCamera />}
                      size="small"
                      fullWidth
                    >
                      {t("form.uploadImage")}
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) =>
                          handleImageFileChange(
                            e,
                            formik.setFieldValue,
                            setImagePreview
                          )
                        }
                      />
                    </Button>
                  </Box>
                </Stack>
              </Box>

              {/* Games Section */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  {t("form.games") || "Juegos del equipo"}
                </Typography>
                
                <FormControl fullWidth>
                  <InputLabel>{t("form.selectGames") || "Seleccionar juegos"}</InputLabel>
                  <Select
                    multiple
                    value={selectedGames}
                    label={t("form.selectGames") || "Seleccionar juegos"}
                    disabled={loadingGames}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedGames(typeof value === "string" ? value.split(",") : value);
                    }}
                    renderValue={(selected) => {
                      const selectedGameNames = (selected as string[])
                        .map((gameId) => availableGames.find((g) => g.id === gameId)?.name)
                        .filter(Boolean);
                      return (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selectedGameNames.map((name) => (
                            <Chip key={name} label={name} size="small" />
                          ))}
                        </Box>
                      );
                    }}
                  >
                    {availableGames.map((game) => (
                      <MenuItem key={game.id} value={game.id}>
                        <Checkbox checked={selectedGames.indexOf(game.id) > -1} />
                        <ListItemText primary={game.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={
                  !formik.isValid || formik.isSubmitting || Boolean(submitting)
                }
              >
                {t("form.save") || "Guardar cambios"}
              </Button>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};

