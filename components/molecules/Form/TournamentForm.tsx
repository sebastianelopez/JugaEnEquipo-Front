import { FC, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Button, MenuItem, Stack } from "@mui/material";
import { MyTextInput, MySelect } from "../../atoms";
import { MyDateTimePicker } from "../../atoms/MyDateTimePicker";
import { GAMES_LIST } from "../../../constants/games";
import type {
  CreateTournamentPayload,
  ParticipationMode,
  TournamentType,
} from "../../../interfaces";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";

interface TournamentFormProps {
  initialValues?: Partial<CreateTournamentPayload>;
  onSubmit: (values: CreateTournamentPayload) => Promise<void> | void;
  submitting?: boolean;
}

type FormValues = Omit<
  CreateTournamentPayload,
  "maxTeams" | "maxParticipants"
> & { maxCount: number };

const toIsoLocal = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${mm}`;
};

export const TournamentForm: FC<TournamentFormProps> = ({
  initialValues,
  onSubmit,
  submitting,
}) => {
  const t = useTranslations("Tournaments");

  const minStartISO = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return d.toISOString();
  }, []);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string().required(t("form.name")).max(80),
        description: Yup.string().max(500),
        type: Yup.mixed<TournamentType>()
          .oneOf(["Oficial", "Amateur"])
          .required(),
        region: Yup.string().required(t("form.region")),
        gameId: Yup.string().required(t("form.game")),
        participationMode: Yup.mixed<ParticipationMode>()
          .oneOf(["individual", "team"])
          .required(),
        maxCount: Yup.number().required().min(2).max(128),
        startDate: Yup.string()
          .required()
          .test(
            "min-start",
            t("dateErrors.minStart", { default: "Start must be at least +1h" }),
            (value) => {
              if (!value) return false;
              return new Date(value) >= new Date(minStartISO);
            }
          ),
        rules: Yup.string().max(2000),
      }),
    [t, minStartISO]
  );

  const defaultValues: FormValues = {
    name: "",
    description: "",
    type: "Amateur",
    region: "LATAM",
    gameId: (GAMES_LIST[0] as any)?.id || (GAMES_LIST[0] as any)?._id || "",
    participationMode: "team",
    maxCount:
      (initialValues as any)?.maxTeams ??
      (initialValues as any)?.maxParticipants ??
      8,
    startDate: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    endDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
    rules: "",
    ...(initialValues as any),
  } as unknown as FormValues;

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={async (values: FormValues, helpers) => {
        const { maxCount, ...rest } = values;
        const payload: CreateTournamentPayload = {
          ...(rest as unknown as CreateTournamentPayload),
          ...(values.participationMode === "team"
            ? { maxTeams: maxCount }
            : { maxParticipants: maxCount }),
        };
        await onSubmit(payload);
        helpers.setSubmitting(false);
      }}
    >
      {(formik) => (
        <Form>
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
            />
            <Box>
              <MySelect
                name="type"
                label={t("form.type")}
                displayEmpty
                fullWidth
              >
                <MenuItem value={"Amateur"}>Amateur</MenuItem>
                <MenuItem value={"Oficial"}>Oficial</MenuItem>
              </MySelect>
            </Box>
            <MyTextInput
              name="region"
              label={t("form.region")}
              placeholder={t("form.region")}
            />
            <Box>
              <MySelect
                name="gameId"
                label={t("form.game")}
                displayEmpty
                fullWidth
              >
                {GAMES_LIST.map((g) => (
                  <MenuItem
                    key={(g as any).id || (g as any)._id}
                    value={(g as any).id || (g as any)._id}
                  >
                    {g.name}
                  </MenuItem>
                ))}
              </MySelect>
            </Box>
            <Box>
              <MySelect
                name="participationMode"
                label={t("form.mode")}
                displayEmpty
                fullWidth
              >
                <MenuItem value={"individual"}>
                  {t("modes.individual")}
                </MenuItem>
                <MenuItem value={"team"}>{t("modes.team")}</MenuItem>
              </MySelect>
            </Box>
            <MyTextInput
              name="maxCount"
              label={
                formik.values.participationMode === "team"
                  ? t("form.maxTeams")
                  : t("form.maxParticipants")
              }
              type="number"
              placeholder={
                formik.values.participationMode === "team"
                  ? t("form.maxTeams")
                  : t("form.maxParticipants")
              }
            />
            <MyDateTimePicker
              label={t("form.startDate")}
              name="startDate"
              minDateTime={dayjs().add(1, "hour")}
            />
            <MyTextInput
              name="rules"
              label={t("form.rules")}
              placeholder={t("form.rules")}
            />

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
      )}
    </Formik>
  );
};
