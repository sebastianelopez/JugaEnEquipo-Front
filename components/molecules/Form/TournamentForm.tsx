import { FC, useMemo, useState, useEffect, useRef } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { Box, Button, MenuItem, Stack, Avatar } from "@mui/material";
import { MyTextInput, MySelect, UserSearchSelect } from "../../atoms";
import { MyDateTimePicker } from "../../atoms/MyDateTimePicker";
import { gameService } from "../../../services/game.service";
import { rankService } from "../../../services/rank.service";
import { Game } from "../../../interfaces";
import { Rank } from "../../../interfaces/rank";
import type { CreateTournamentPayload } from "../../../interfaces";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { getGameImage } from "../../../utils/gameImageUtils";

interface TournamentFormProps {
  initialValues?: Partial<CreateTournamentPayload>;
  onSubmit: (values: CreateTournamentPayload) => Promise<void> | void;
  submitting?: boolean;
  isAdminForm?: boolean; // If true, show creatorId and responsibleId fields
  submitButtonText?: string; // Custom text for submit button
  whiteText?: boolean;
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

export const TournamentForm: FC<TournamentFormProps> = ({
  initialValues,
  onSubmit,
  submitting,
  isAdminForm = false,
  submitButtonText,
  whiteText = false,
}) => {
  const t = useTranslations("Tournaments");
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loadingRanks, setLoadingRanks] = useState(false);

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
        minGameRankId: Yup.string().nullable(),
        maxGameRankId: Yup.string().nullable(),
        creatorId: isAdminForm
          ? Yup.string().required(t("form.creatorRequired"))
          : Yup.string().nullable(),
        responsibleId: isAdminForm
          ? Yup.string().required(t("form.responsibleRequired"))
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
      image: null,
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
      image: null,
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
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 600 }}>
              <MyTextInput
                name="name"
                label={t("form.name")}
                placeholder={t("form.name")}
                whiteText={whiteText}
              />
              <MyTextInput
                name="description"
                label={t("form.description")}
                placeholder={t("form.description")}
                multiline
                rows={3}
                whiteText={whiteText}
              />

              <MySelect
                name="region"
                label={t("form.region")}
                displayEmpty
                fullWidth
                disabled={loadingGames}
                whiteText={whiteText}
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
                  whiteText={whiteText}
                  renderValue={(value: string) => {
                    const selectedGame = games.find((g) => g.id === value);
                    if (!selectedGame) return "";
                    return (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          src={getGameImage(selectedGame.name)}
                          alt={selectedGame.name}
                          sx={{
                            width: 24,
                            height: 24,
                          }}
                        >
                          {selectedGame.name.charAt(0).toUpperCase()}
                        </Avatar>
                        {selectedGame.name}
                      </Box>
                    );
                  }}
                >
                  {games.map((g) => (
                    <MenuItem key={g.id} value={g.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          src={getGameImage(g.name)}
                          alt={g.name}
                          sx={{
                            width: 32,
                            height: 32,
                          }}
                        >
                          {g.name.charAt(0).toUpperCase()}
                        </Avatar>
                        {g.name}
                      </Box>
                    </MenuItem>
                  ))}
                </MySelect>
              </Box>

              <MySelect
                name="maxTeams"
                label={t("form.maxTeams")}
                displayEmpty
                fullWidth
                whiteText={whiteText}
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
                    label={t("form.creator")}
                    placeholder={t("form.creatorPlaceholder")}
                    required
                    whiteText={whiteText}
                  />
                  <UserSearchSelect
                    name="responsibleId"
                    label={t("form.responsible")}
                    placeholder={t("form.responsiblePlaceholder")}
                    required
                    whiteText={whiteText}
                  />
                </>
              )}

              <MyDateTimePicker
                label={t("form.startDate")}
                name="startAt"
                minDateTime={dayjs().add(1, "hour")}
                whiteText={whiteText}
              />

              <MyDateTimePicker
                label={t("form.endDate")}
                name="endAt"
                minDateTime={dayjs(formik.values.startAt).add(1, "hour")}
                whiteText={whiteText}
              />

              {formik.values.gameId && ranks.length > 0 && (
                <>
                  <MySelect
                    name="minGameRankId"
                    label={t("form.minRank")}
                    displayEmpty
                    fullWidth
                    disabled={loadingRanks}
                    whiteText={whiteText}
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
                    whiteText={whiteText}
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
                {submitButtonText || t("create")}
              </Button>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};
