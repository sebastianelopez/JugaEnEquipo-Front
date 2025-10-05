import {
  Typography,
  Divider,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { FC, useCallback } from "react";
import { useTranslations } from "next-intl";

interface SettingsAccountProps {
  onUpdatePassword?: (data: PasswordFormData) => void;
  onDeleteAccount?: () => void;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const SettingsAccount: FC<SettingsAccountProps> = ({
  onUpdatePassword,
  onDeleteAccount,
}) => {
  const t = useTranslations("Settings");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data: PasswordFormData = {
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword") as string,
        confirmPassword: formData.get("confirmPassword") as string,
      };
      onUpdatePassword?.(data);
    },
    [onUpdatePassword]
  );

  const handleDeleteAccount = useCallback(() => {
    onDeleteAccount?.();
  }, [onDeleteAccount]);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {t("accountSettings")}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        <TextField
          fullWidth
          name="currentPassword"
          label={t("currentPassword")}
          type="password"
          variant="outlined"
        />
        <TextField
          fullWidth
          name="newPassword"
          label={t("newPassword")}
          type="password"
          variant="outlined"
        />
        <TextField
          fullWidth
          name="confirmPassword"
          label={t("confirmPassword")}
          type="password"
          variant="outlined"
        />

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            sx={{ mr: 2 }}
            onClick={handleDeleteAccount}
            type="button"
          >
            {t("deleteAccount")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            {t("updatePassword")}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
