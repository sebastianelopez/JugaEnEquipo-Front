import { FC, useMemo, useState, useEffect, useRef } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  Typography,
  Avatar,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { MyTextInput, MySelect, UserSearchSelect } from "../../atoms";
import { MyDateTimePicker } from "../../atoms/MyDateTimePicker";
import { gameService } from "../../../services/game.service";
import { rankService } from "../../../services/rank.service";
import { Game } from "../../../interfaces";
import { Rank } from "../../../interfaces/rank";
import type { CreateTournamentPayload } from "../../../interfaces";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { handleImageFileChange } from "../../../utils/imageFileUtils";

interface TournamentFormProps {
  initialValues?: Partial<CreateTournamentPayload>;
  onSubmit: (values: CreateTournamentPayload) => Promise<void> | void;
  submitting?: boolean;
  isAdminForm?: boolean; // If true, show creatorId and responsibleId fields
}

type FormValues = Omit<CreateTournamentPayload, "startAt" | "endAt"> & {
  startAt: string;
  endAt: string;
  creatorId?: string;
};

const GameIdWatcher: FC<{
  onGameChange: (gameId: string) => void;
}> = ({ onGameChange }) => {
  const { values } = useFormikContext<FormValues>();
  const prevGameIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (values.gameId && values.gameId !== prevGameIdRef.current) {
      prevGameIdRef.current = values.gameId;
      onGameChange(values.gameId);
    }
  }, [values.gameId, onGameChange]);

  return null;
};

const ImageWatcher: FC<{
  onImageChange: (image: string | null) => void;
}> = ({ onImageChange }) => {
  const { values } = useFormikContext<FormValues>();
  const prevImageRef = useRef<string | null>(null);

  useEffect(() => {
    if (values.image !== prevImageRef.current) {
      prevImageRef.current = values.image || null;
      // Update preview if it's a URL or base64
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

export const TournamentForm: FC<TournamentFormProps> = ({
  initialValues,
  onSubmit,
  submitting,
  isAdminForm = false,
}) => {
  const t = useTranslations("Tournaments");
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loadingRanks, setLoadingRanks] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image || null
  );

  useEffect(() => {
    const fetchGames = async () => {
      setLoadingGames(true);
      const result = await gameService.getAllGames();
      if (result.ok && result.data) {
        setGames(result.data);
      }
      setLoadingGames(false);
    };
    fetchGames();
  }, []);

  // Update preview when initialValues change
  useEffect(() => {
    if (initialValues?.image) {
      setImagePreview(initialValues.image);
    }
  }, [initialValues?.image]);

  const fetchRanks = async (gameId: string) => {
    if (!gameId) {
      setRanks([]);
      return;
    }
    setLoadingRanks(true);
    const result = await rankService.findAllByGame(gameId);
    if (result.ok && result.data) {
      setRanks(result.data);
    }
    setLoadingRanks(false);
  };

  const minStartISO = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return d.toISOString();
  }, []);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string().required(t("form.name")).max(80),
        description: Yup.string().max(500),
        region: Yup.string().required(t("form.region")),
        gameId: Yup.string().required(t("form.game")),
        maxTeams: Yup.number()
          .required(t("form.maxTeams"))
          .oneOf(
            [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
            t("form.maxTeamsInvalid")
          ),
        startAt: Yup.string()
          .required()
          .test(
            "min-start",
            t("dateErrors.minStart", { default: "Start must be at least +1h" }),
            (value) => {
              if (!value) return false;
              return new Date(value) >= new Date(minStartISO);
            }
          ),
        endAt: Yup.string()
          .required()
          .test("after-start", t("dateErrors.endAfterStart"), function (value) {
            const { startAt } = this.parent;
            if (!value || !startAt) return false;
            return new Date(value) > new Date(startAt);
          }),
        image: Yup.string()
          .nullable()
          .test("image-format", "Image must be a base64 string", (value) => {
            if (!value) return true; // null/empty is allowed
            // Only accept base64 data URLs
            return /^data:image\//.test(value);
          }),
        minGameRankId: Yup.string().nullable(),
        maxGameRankId: Yup.string().nullable(),
        creatorId: isAdminForm
          ? Yup.string().required("El creador es requerido")
          : Yup.string().nullable(),
        responsibleId: isAdminForm
          ? Yup.string().required("El responsable es requerido")
          : Yup.string().nullable(),
      }),
    [t, minStartISO, isAdminForm]
  );

  const defaultValues: FormValues = useMemo(() => {
    // Calculate default startAt to be at least 1 hour from now (matching validation)
    const defaultStartAt = initialValues?.startAt || minStartISO;

    // Calculate default endAt to be at least 1 hour after startAt (matching validation)
    const defaultEndAt =
      initialValues?.endAt ||
      (() => {
        const endDate = new Date(defaultStartAt);
        endDate.setHours(endDate.getHours() + 1);
        return endDate.toISOString();
      })();

    return {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      isOfficial: initialValues?.isOfficial ?? false,
      region: initialValues?.region || "LATAM",
      gameId: games[0]?.id || initialValues?.gameId || "",
      maxTeams: initialValues?.maxTeams ?? 8,
      startAt: defaultStartAt,
      endAt: defaultEndAt,
      image: initialValues?.image || null,
      prize: initialValues?.prize || null,
      responsibleId: initialValues?.responsibleId || null,
      creatorId: initialValues?.creatorId || null,
      minGameRankId: initialValues?.minGameRankId || "",
      maxGameRankId: initialValues?.maxGameRankId || "",
    } as FormValues;
  }, [games, initialValues, minStartISO]);

  const handleSubmit = async (
    values: FormValues,
    helpers: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const toNullIfEmpty = (value: string | null | undefined): string | null => {
      if (!value || (typeof value === "string" && !value.trim())) return null;
      return typeof value === "string" ? value.trim() : value;
    };

    const payload: CreateTournamentPayload = {
      gameId: values.gameId,
      responsibleId: values.responsibleId || null,
      creatorId: values.creatorId || null,
      name: values.name,
      description: values.description,
      maxTeams: values.maxTeams,
      isOfficial: values.isOfficial,
      image: toNullIfEmpty(values.image),
      prize: toNullIfEmpty(values.prize),
      region: values.region,
      startAt: values.startAt,
      endAt: values.endAt,
      minGameRankId: toNullIfEmpty(values.minGameRankId),
      maxGameRankId: toNullIfEmpty(values.maxGameRankId),
    };
    await onSubmit(payload);
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
        const handleGameChange = (gameId: string) => {
          fetchRanks(gameId);

          formik.setFieldValue("minGameRankId", "");
          formik.setFieldValue("maxGameRankId", "");
        };

        return (
          <Form>
            <GameIdWatcher onGameChange={handleGameChange} />
            <ImageWatcher onImageChange={setImagePreview} />
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 600 }}>
              <MyTextInput
                name="name"
                label={t("form.name")}
                placeholder={t("form.name")}
              />
              <MyTextInput
                name="description"
                label={t("form.description")}
                placeholder={t("form.description")}
                multiline
                rows={3}
              />

              <MySelect
                name="region"
                label={t("form.region")}
                displayEmpty
                fullWidth
                disabled={loadingGames}
              >
                <MenuItem value={"LATAM"}>{"LATAM"}</MenuItem>
              </MySelect>

              <Box>
                <MySelect
                  name="gameId"
                  label={t("form.game")}
                  displayEmpty
                  fullWidth
                  disabled={loadingGames}
                >
                  {games.map((g) => (
                    <MenuItem key={g.id} value={g.id}>
                      {g.name}
                    </MenuItem>
                  ))}
                </MySelect>
              </Box>

              <MySelect
                name="maxTeams"
                label={t("form.maxTeams")}
                displayEmpty
                fullWidth
              >
                {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </MySelect>

              {isAdminForm && (
                <>
                  <UserSearchSelect
                    name="creatorId"
                    label="Creador del torneo"
                    placeholder="Buscar usuario creador..."
                    required
                  />
                  <UserSearchSelect
                    name="responsibleId"
                    label="Responsable del torneo"
                    placeholder="Buscar usuario responsable..."
                    required
                  />
                </>
              )}

              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t("form.image")}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  {imagePreview && (
                    <Avatar
                      src={imagePreview}
                      alt="Tournament preview"
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

              <MyDateTimePicker
                label={t("form.startDate")}
                name="startAt"
                minDateTime={dayjs().add(1, "hour")}
              />

              <MyDateTimePicker
                label={t("form.endDate")}
                name="endAt"
                minDateTime={dayjs(formik.values.startAt).add(1, "hour")}
              />

              {formik.values.gameId && ranks.length > 0 && (
                <>
                  <MySelect
                    name="minGameRankId"
                    label={t("form.minRank")}
                    displayEmpty
                    fullWidth
                    disabled={loadingRanks}
                  >
                    <MenuItem value="">
                      <em>{t("form.none")}</em>
                    </MenuItem>
                    {ranks.map((rank) => (
                      <MenuItem key={rank.id} value={rank.id}>
                        {rank.rankName} (Level {rank.level})
                      </MenuItem>
                    ))}
                  </MySelect>

                  <MySelect
                    name="maxGameRankId"
                    label={t("form.maxRank")}
                    displayEmpty
                    fullWidth
                    disabled={loadingRanks}
                  >
                    <MenuItem value="">
                      <em>{t("form.none")}</em>
                    </MenuItem>
                    {ranks.map((rank) => (
                      <MenuItem key={rank.id} value={rank.id}>
                        {rank.rankName} (Level {rank.level})
                      </MenuItem>
                    ))}
                  </MySelect>
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={
                  !formik.isValid || formik.isSubmitting || Boolean(submitting)
                }
              >
                {t("create")}
              </Button>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};
