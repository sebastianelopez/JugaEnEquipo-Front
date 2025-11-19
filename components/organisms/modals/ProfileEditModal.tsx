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
      const file = e.target.files?.[0];
      if (file) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
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
      sx={[...(Array.isArray(sx) ? sx : [sx]), { marginInline: 3 }]}
    >
      <Box
        component="div"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="edit-profile-modal-title"
          variant="h6"
          sx={{ mb: 2, fontWeight: 700 }}
        >
          {t("title")}
        </Typography>

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              sx={{ width: 120, height: 120, mb: 2 }}
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
          />

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
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
          />
          <TextField
            label={t("youtubeUrl")}
            placeholder={t("youtubePlaceholder")}
            fullWidth
            value={links.youtube || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, youtube: e.target.value }))
            }
          />
          <TextField
            label={t("twitterUrl")}
            placeholder={t("twitterPlaceholder")}
            fullWidth
            value={links.twitter || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, twitter: e.target.value }))
            }
          />
          <TextField
            label={t("instagramUrl")}
            placeholder={t("instagramPlaceholder")}
            fullWidth
            value={links.instagram || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, instagram: e.target.value }))
            }
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="text" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {t("save")}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
