import {
  Modal,
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Avatar,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { SxProps, Theme } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { handleImagePreviewChange } from "../../../utils/imageFileUtils";

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    description: string;
    socialLinks: SocialLinks;
    profileImage?: File;
  }) => void;
  initialDescription?: string;
  initialSocialLinks?: SocialLinks;
  initialProfileImage?: string;
  initialUsername?: string;
  sx?: SxProps<Theme>;
}

export const ProfileEditModal = ({
  open,
  onClose,
  onSave,
  initialDescription = "",
  initialSocialLinks = {},
  initialProfileImage,
  initialUsername,
  sx = [],
}: Props) => {
  const t = useTranslations("ProfileEditModal");
  const [description, setDescription] = useState<string>(initialDescription);
  const [links, setLinks] = useState<SocialLinks>(initialSocialLinks);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    initialProfileImage
  );

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  useEffect(() => {
    setLinks(initialSocialLinks || {});
  }, [initialSocialLinks]);

  useEffect(() => {
    setPreviewImage(initialProfileImage);
    setSelectedImage(null);
  }, [initialProfileImage]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleImagePreviewChange(
        e,
        (preview) => setPreviewImage(preview || undefined),
        setSelectedImage
      );
    },
    []
  );

  const handleSave = () => {
    onSave({
      description,
      socialLinks: links,
      profileImage: selectedImage || undefined,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-profile-modal-title"
      sx={[
        ...(Array.isArray(sx) ? sx : [sx]),
        {
          marginInline: { xs: 1, sm: 3 },
          display: "flex",
          alignItems: { xs: "flex-end", sm: "center" },
          justifyContent: "center",
        },
      ]}
    >
      <Box
        component="div"
        sx={{
          position: "absolute",
          top: { xs: "auto", sm: "50%" },
          bottom: { xs: 0, sm: "auto" },
          left: { xs: 0, sm: "50%" },
          right: { xs: 0, sm: "auto" },
          transform: { xs: "none", sm: "translate(-50%, -50%)" },
          width: { xs: "100%", sm: "90%", md: "100%" },
          maxWidth: 600,
          maxHeight: { xs: "90vh", sm: "90vh" },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: "16px 16px 0 0", sm: 2 },
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          id="edit-profile-modal-title"
          variant="h6"
          sx={{
            mb: { xs: 1.5, md: 2 },
            fontWeight: 700,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
          }}
        >
          {t("title")}
        </Typography>

        <Stack
          spacing={{ xs: 1.5, md: 2 }}
          sx={{ mb: { xs: 1.5, md: 2 }, flex: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: { xs: 1, md: 2 },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                mb: { xs: 1, md: 2 },
              }}
              alt={initialUsername || t("profilePictureAlt")}
              src={previewImage || "/images/user-placeholder.png"}
            >
              {!previewImage && initialUsername?.[0]?.toUpperCase()}
            </Avatar>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              size="small"
              sx={{
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                px: { xs: 1.5, md: 2 },
              }}
            >
              {t("changePhoto")}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <TextField
            label={t("aboutMe")}
            placeholder={t("aboutMePlaceholder")}
            multiline
            minRows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
              },
            }}
          />

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: { xs: 0.5, md: 1 },
              fontSize: { xs: "0.95rem", md: "1rem" },
            }}
          >
            {t("socialNetworks")}
          </Typography>
          <TextField
            label={t("twitchUrl")}
            placeholder={t("twitchPlaceholder")}
            fullWidth
            value={links.twitch || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, twitch: e.target.value }))
            }
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
              },
            }}
          />
          <TextField
            label={t("youtubeUrl")}
            placeholder={t("youtubePlaceholder")}
            fullWidth
            value={links.youtube || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, youtube: e.target.value }))
            }
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
              },
            }}
          />
          <TextField
            label={t("twitterUrl")}
            placeholder={t("twitterPlaceholder")}
            fullWidth
            value={links.twitter || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, twitter: e.target.value }))
            }
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
              },
            }}
          />
          <TextField
            label={t("instagramUrl")}
            placeholder={t("instagramPlaceholder")}
            fullWidth
            value={links.instagram || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, instagram: e.target.value }))
            }
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
              },
            }}
          />
        </Stack>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={{ xs: 1, sm: 2 }}
          justifyContent="flex-end"
          sx={{
            mt: { xs: 1, md: 0 },
            pt: { xs: 2, md: 0 },
            borderTop: { xs: "1px solid", sm: "none" },
            borderColor: { xs: "divider", sm: "transparent" },
          }}
        >
          <Button
            variant="text"
            onClick={onClose}
            fullWidth={true}
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              py: { xs: 1.25, md: 0.75 },
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            fullWidth={true}
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              py: { xs: 1.25, md: 0.75 },
            }}
          >
            {t("save")}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
