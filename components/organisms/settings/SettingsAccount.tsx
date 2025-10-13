import {
  Typography,
  Divider,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { FC, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { usePasswordValidation } from "../../../hooks";
import { PasswordRequirements } from "../../molecules/Form/PasswordRequirements";

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
  const [currentPassword, setCurrentPassword] = useState("");
  const {
    password: newPassword,
    setPassword: setNewPassword,
    confirmPassword,
    setConfirmPassword,
    validation,
    confirmPasswordError,
    isFormValid,
  } = usePasswordValidation();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isFormValid || !currentPassword) {
        return;
      }

      const data: PasswordFormData = {
        currentPassword,
        newPassword,
        confirmPassword,
      };
      onUpdatePassword?.(data);

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    [
      currentPassword,
      newPassword,
      confirmPassword,
      isFormValid,
      onUpdatePassword,
      setNewPassword,
      setConfirmPassword,
    ]
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
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <Box>
          <TextField
            fullWidth
            name="newPassword"
            label={t("newPassword")}
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={newPassword.length > 0 && !validation.isValid}
            required
          />
          <PasswordRequirements
            rules={validation.rules}
            show={newPassword.length > 0}
          />
        </Box>

        <TextField
          fullWidth
          name="confirmPassword"
          label={t("confirmPassword")}
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          required
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
            disabled={!isFormValid || !currentPassword}
          >
            {t("updatePassword")}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
