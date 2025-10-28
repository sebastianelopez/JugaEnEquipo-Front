import {
  Modal,
  Box,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useEffect, useState } from "react";

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: { aboutText: string; socialLinks: SocialLinks }) => void;
  initialAboutText?: string;
  initialSocialLinks?: SocialLinks;
  sx?: SxProps<Theme>;
}

export const ProfileEditModal = ({
  open,
  onClose,
  onSave,
  initialAboutText = "",
  initialSocialLinks = {},
  sx = [],
}: Props) => {
  const [aboutText, setAboutText] = useState<string>(initialAboutText);
  const [links, setLinks] = useState<SocialLinks>(initialSocialLinks);

  useEffect(() => {
    setAboutText(initialAboutText);
  }, [initialAboutText]);

  useEffect(() => {
    setLinks(initialSocialLinks || {});
  }, [initialSocialLinks]);

  const handleSave = () => {
    onSave({ aboutText, socialLinks: links });
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
          background: "white",
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
          Completar perfil
        </Typography>

        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Sobre mí"
            placeholder="Cuéntanos sobre ti..."
            multiline
            minRows={3}
            fullWidth
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
          />

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
            Redes sociales
          </Typography>
          <TextField
            label="Twitch URL"
            placeholder="https://twitch.tv/usuario"
            fullWidth
            value={links.twitch || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, twitch: e.target.value }))
            }
          />
          <TextField
            label="YouTube URL"
            placeholder="https://youtube.com/@canal"
            fullWidth
            value={links.youtube || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, youtube: e.target.value }))
            }
          />
          <TextField
            label="Twitter/X URL"
            placeholder="https://x.com/usuario"
            fullWidth
            value={links.twitter || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, twitter: e.target.value }))
            }
          />
          <TextField
            label="Instagram URL"
            placeholder="https://instagram.com/usuario"
            fullWidth
            value={links.instagram || ""}
            onChange={(e) =>
              setLinks((prev) => ({ ...prev, instagram: e.target.value }))
            }
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="text" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
