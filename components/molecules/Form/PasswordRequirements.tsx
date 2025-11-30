import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { FC } from "react";
import { useTranslations } from "next-intl";
import type { PasswordValidationRules } from "../../../hooks/usePasswordValidation";

interface PasswordRequirementsProps {
  rules: PasswordValidationRules;
  show?: boolean;
}

export const PasswordRequirements: FC<PasswordRequirementsProps> = ({
  rules,
  show = true,
}) => {
  const t = useTranslations("Validation");

  if (!show) return null;

  const requirements = [
    { key: "minLength", met: rules.minLength, text: t("minLength") },
    { key: "hasUpperCase", met: rules.hasUpperCase, text: t("hasUpperCase") },
    { key: "hasLowerCase", met: rules.hasLowerCase, text: t("hasLowerCase") },
    { key: "hasNumber", met: rules.hasNumber, text: t("hasNumber") },
    {
      key: "hasSpecialChar",
      met: rules.hasSpecialChar,
      text: t("hasSpecialChar"),
    },
  ];

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        {t("passwordRequirements")}
      </Typography>
      <List dense disablePadding>
        {requirements.map((req) => (
          <ListItem key={req.key} disablePadding sx={{ py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {req.met ? (
                <CheckCircleIcon color="success" fontSize="small" />
              ) : (
                <CancelIcon color="error" fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={req.text}
              primaryTypographyProps={{
                variant: "caption",
                color: req.met ? "success.main" : "error.main",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
