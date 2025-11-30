import {
  Typography,
  Divider,
  Button,
  Switch,
  FormControlLabel,
  Stack,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { FC, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface SettingsNotificationsProps {
  onSave?: (preferences: NotificationPreferences) => void;
}

export interface NotificationPreferences {
  enableNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingNotifications: boolean;
}

export const SettingsNotifications: FC<SettingsNotificationsProps> = ({
  onSave,
}) => {
  const t = useTranslations("Settings");
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
    marketingNotifications: false,
  });

  const handleChange = useCallback(
    (field: keyof NotificationPreferences) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setPreferences((prev) => ({
          ...prev,
          [field]: e.target.checked,
        }));
      },
    []
  );

  const handleSave = useCallback(() => {
    onSave?.(preferences);
  }, [onSave, preferences]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t("notificationPreferences")}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.enableNotifications}
              onChange={handleChange("enableNotifications")}
            />
          }
          label={t("enableNotifications")}
        />

        <FormControlLabel
          control={
            <Switch
              checked={preferences.emailNotifications}
              onChange={handleChange("emailNotifications")}
            />
          }
          label={t("emailNotifications")}
        />

        <FormControlLabel
          control={
            <Switch
              checked={preferences.pushNotifications}
              onChange={handleChange("pushNotifications")}
            />
          }
          label={t("pushNotifications")}
        />

        <FormControlLabel
          control={
            <Switch
              checked={preferences.marketingNotifications}
              onChange={handleChange("marketingNotifications")}
            />
          }
          label={t("marketingNotifications")}
        />
      </Stack>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          {t("savePreferences")}
        </Button>
      </Box>
    </Box>
  );
};
