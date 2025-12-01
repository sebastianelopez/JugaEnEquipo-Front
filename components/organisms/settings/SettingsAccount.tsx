import {
  Typography,
  Divider,
  TextField,
  Button,
  Stack,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FC, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { usePasswordValidation } from "../../../hooks";
import { PasswordRequirements } from "../../molecules/Form/PasswordRequirements";

interface SettingsAccountProps {
  onUpdatePassword?: (data: PasswordFormData) => void | Promise<void>;
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isFormValid || !currentPassword) {
        return;
      }

      const data: PasswordFormData = {
        currentPassword,
        newPassword,
        confirmPassword,
      };

      try {
        await onUpdatePassword?.(data);
        // Reset form only on success
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } catch (error) {
        // Error handling is done in the parent component via dialogs
        // Form is not reset on error so user can retry
      }
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
          type={showCurrentPassword ? "text" : "password"}
          variant="outlined"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />

        <Box>
          <TextField
            fullWidth
            name="newPassword"
            label={t("newPassword")}
            type={showNewPassword ? "text" : "password"}
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={newPassword.length > 0 && !validation.isValid}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />

        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            type="button"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {t("deleteAccount")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={!isFormValid || !currentPassword}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {t("updatePassword")}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
