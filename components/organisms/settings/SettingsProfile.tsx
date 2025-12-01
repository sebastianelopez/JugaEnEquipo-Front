import {
  Typography,
  Divider,
  TextField,
  Button,
  Grid,
  Stack,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { FC, useCallback, useContext } from "react";
import { useTranslations } from "next-intl";
import { UserContext } from "../../../context/user";

interface SettingsProfileProps {
  onSave?: (data: ProfileFormData) => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export const SettingsProfile: FC<SettingsProfileProps> = ({ onSave }) => {
  const t = useTranslations("Settings");
  const { user } = useContext(UserContext);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data: ProfileFormData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
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
        <Grid size={{ xs: 12 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              name="firstName"
              label={t("firstName")}
              defaultValue={user?.firstname || ""}
              variant="outlined"
            />
            <TextField
              fullWidth
              name="lastName"
              label={t("lastName")}
              defaultValue={user?.lastname || ""}
              variant="outlined"
            />
            <TextField
              fullWidth
              name="username"
              label={t("username")}
              defaultValue={user?.username || ""}
              variant="outlined"
              disabled
              helperText={t("usernameHelperText")}
            />
            <TextField
              fullWidth
              name="email"
              label={t("email")}
              defaultValue={user?.email || ""}
              variant="outlined"
              type="email"
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
