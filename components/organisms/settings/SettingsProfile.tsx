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
import { FC, useCallback, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { UserContext } from "../../../context/user";
import { handleImagePreviewChange } from "../../../utils/imageFileUtils";

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
  const { user } = useContext(UserContext);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    user?.profileImage
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleImagePreviewChange(e, (preview) =>
        setPreviewImage(preview || undefined)
      );
    },
    []
  );

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
          size={{ xs: 12, sm: 4 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{ width: 100, height: 100, mb: 2 }}
            alt={user?.username || t("profilePicture")}
            src={previewImage || "/images/user-placeholder.png"}
          >
            {!previewImage && user?.firstname?.[0]?.toUpperCase()}
          </Avatar>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            size="small"
          >
            {t("changePhoto")}
            <input
              hidden
              accept="image/*"
              type="file"
              name="profileImage"
              onChange={handleImageChange}
            />
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
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
