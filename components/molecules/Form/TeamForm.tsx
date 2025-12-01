import { FC, useMemo, useState, useEffect, useRef } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, Typography, Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { MyTextInput } from "../../atoms";
import { useTranslations } from "next-intl";
import { handleImageFileChange } from "../../../utils/imageFileUtils";

interface CreateTeamPayload {
  name: string;
  description?: string;
  image?: string;
}

interface TeamFormProps {
  initialValues?: Partial<CreateTeamPayload>;
  onSubmit: (values: CreateTeamPayload) => Promise<void> | void;
  submitting?: boolean;
}

const ImageWatcher: FC<{
  onImageChange: (image: string | null) => void;
}> = ({ onImageChange }) => {
  const { values } = useFormikContext<CreateTeamPayload>();
  const prevImageRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (values.image !== prevImageRef.current) {
      prevImageRef.current = values.image || undefined;
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

export const TeamForm: FC<TeamFormProps> = ({
  initialValues,
  onSubmit,
  submitting,
}) => {
  const t = useTranslations("Teams");
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image || null
  );

  // Update preview when initialValues change
  useEffect(() => {
    if (initialValues?.image) {
      setImagePreview(initialValues.image);
    }
  }, [initialValues?.image]);

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
            if (!value) return true; // null/empty is allowed

            return /^data:image\//.test(value);
          }),
      }),
    [t]
  );

  const defaultValues: CreateTeamPayload = useMemo(() => {
    return {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      image: initialValues?.image || undefined,
    };
  }, [initialValues]);

  const handleSubmit = async (
    values: CreateTeamPayload & {
      image?: string | null;
      description?: string | null;
    },
    helpers: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const toUndefinedIfEmpty = (
      value: string | null | undefined
    ): string | undefined => {
      if (!value || (typeof value === "string" && !value.trim()))
        return undefined;
      return typeof value === "string" ? value.trim() : undefined;
    };

    const payload: CreateTeamPayload = {
      name: values.name.trim(),
      description: toUndefinedIfEmpty(values.description),
      image: toUndefinedIfEmpty(values.image),
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
        return (
          <Form>
            <ImageWatcher onImageChange={setImagePreview} />
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 600 }}>
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
