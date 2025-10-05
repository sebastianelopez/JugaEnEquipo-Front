import {
  Typography,
  Divider,
  TextField,
  Button,
  Avatar,
  Grid,
  Stack,
  Box,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import { FC, useCallback } from "react";
import { useTranslations } from "next-intl";

interface SettingsProfileProps {
  onSave?: (data: ProfileFormData) => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profileImage?: File;
}

export const SettingsProfile: FC<SettingsProfileProps> = ({ onSave }) => {
  const t = useTranslations("Settings");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data: ProfileFormData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        bio: formData.get("bio") as string,
      };
      onSave?.(data);
    },
    [onSave]
  );

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {t("profileInformation")}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{ width: 100, height: 100, mb: 2 }}
            alt={t("profilePicture")}
            src="/profile-placeholder.jpg"
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            size="small"
          >
            {t("changePhoto")}
            <input hidden accept="image/*" type="file" name="profileImage" />
          </Button>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              name="firstName"
              label={t("firstName")}
              defaultValue="Usuario"
              variant="outlined"
            />
            <TextField
              fullWidth
              name="lastName"
              label={t("lastName")}
              defaultValue="De Ejemplo"
              variant="outlined"
            />
            <TextField
              fullWidth
              name="email"
              label={t("email")}
              defaultValue="usuario@ejemplo.com"
              variant="outlined"
              type="email"
            />
            <TextField
              fullWidth
              name="bio"
              label={t("bio")}
              defaultValue=""
              variant="outlined"
              multiline
              rows={4}
              placeholder={t("bioPlaceholder")}
            />
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          {t("saveChanges")}
        </Button>
      </Box>
    </Box>
  );
};
