import {
  Modal,
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PersonIcon from "@mui/icons-material/Person";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import { useEffect, useState, useCallback, useContext } from "react";
import { useTranslations } from "next-intl";
import { handleImagePreviewChange } from "../../../utils/imageFileUtils";
import { UserContext } from "../../../context/user";
import { SettingsGames } from "../../organisms/settings/SettingsGames";
import { SocialNetworksManager } from "../profile/SocialNetworksManager";

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
    backgroundImage?: string; // base64 data URI
  }) => void;
  initialDescription?: string;
  initialSocialLinks?: SocialLinks;
  initialProfileImage?: string;
  initialBackgroundImage?: string;
  initialUsername?: string;
  sx?: SxProps<Theme>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-edit-tabpanel-${index}`}
      aria-labelledby={`profile-edit-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export const ProfileEditModal = ({
  open,
  onClose,
  onSave,
  initialDescription = "",
  initialSocialLinks = {},
  initialProfileImage,
  initialBackgroundImage,
  initialUsername,
  sx = [],
}: Props) => {
  const t = useTranslations("ProfileEditModal");
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const [tabValue, setTabValue] = useState(0);
  const [description, setDescription] = useState<string>(initialDescription);
  const [links, setLinks] = useState<SocialLinks>(initialSocialLinks);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    initialProfileImage
  );
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState<string | null>(null);
  const [previewBackgroundImage, setPreviewBackgroundImage] = useState<string | undefined>(
    initialBackgroundImage
  );

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

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

  useEffect(() => {
    setPreviewBackgroundImage(initialBackgroundImage);
    setSelectedBackgroundImage(null);
  }, [initialBackgroundImage]);

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

  const handleBackgroundImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleImagePreviewChange(
        e,
        (preview) => {
          setPreviewBackgroundImage(preview || undefined);
          setSelectedBackgroundImage(preview);
        }
      );
    },
    []
  );

  const handleSave = () => {
    onSave({
      description,
      socialLinks: links, // Keep for backward compatibility, but SocialNetworksManager handles it now
      profileImage: selectedImage || undefined,
      backgroundImage: selectedBackgroundImage || undefined,
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
          maxWidth: { xs: "100%", sm: 600, md: 800 },
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

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label={t("title")}
          variant="fullWidth"
          sx={{
            mb: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab
            icon={<PersonIcon />}
            iconPosition="start"
            label={t("profileTab")}
            id="profile-edit-tab-0"
            aria-controls="profile-edit-tabpanel-0"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          />
          <Tab
            icon={<SportsEsportsIcon />}
            iconPosition="start"
            label={t("gamesTab")}
            id="profile-edit-tab-1"
            aria-controls="profile-edit-tabpanel-1"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
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

          {/* Background Image Upload */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: { xs: 1, md: 2 },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: { xs: 120, sm: 150, md: 180 },
                borderRadius: 2,
                overflow: "hidden",
                mb: { xs: 1, md: 2 },
                border: `2px dashed ${theme.palette.divider}`,
                position: "relative",
                cursor: "pointer",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {previewBackgroundImage ? (
                <Box
                  component="img"
                  src={previewBackgroundImage}
                  alt="Background preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.palette.background.default,
                  }}
                >
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    {t("backgroundImagePlaceholder") || "Imagen de fondo"}
                  </Typography>
                </Box>
              )}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleBackgroundImageChange}
                id="background-image-input"
              />
            </Box>
            <Button
              variant="outlined"
              component="label"
              htmlFor="background-image-input"
              startIcon={<PhotoCamera />}
              size="small"
              sx={{
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                px: { xs: 1.5, md: 2 },
              }}
            >
              {t("changeBackground") || "Cambiar fondo"}
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

          <SocialNetworksManager
            userId={user?.id || ""}
            onUpdate={() => {
              // Refresh data when social networks are updated
            }}
          />
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ maxHeight: "60vh", overflowY: "auto", pb: 2 }}>
            <SettingsGames />
          </Box>
        </TabPanel>

        {tabValue === 0 && (
          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            justifyContent="flex-end"
            sx={{
              mt: "auto",
              pt: { xs: 2, md: 2 },
              borderTop: "1px solid",
              borderColor: "divider",
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
        )}
      </Box>
    </Modal>
  );
};
