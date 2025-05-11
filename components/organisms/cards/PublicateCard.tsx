import {
  Avatar,
  Box,
  Button,
  Input,
  Paper,
  SxProps,
  Theme,
} from "@mui/material";
import { useState } from "react";
import { useTranslations } from "next-intl";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { CreatePublicationModal } from "../";

interface Props {
  sx?: SxProps<Theme>;
}

export const PublicateCard = ({ sx = [] }: Props) => {
  const t = useTranslations("Publication");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Paper
        sx={[
          {
            width: { xs: "100%", md: 530 },
            maxWidth: { xs: 530 },
            mb: 5,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <Box
          component="div"
          display="flex"
          sx={{
            p: 1.5,
          }}
        >
          <Avatar />
          <Input
            placeholder="Crear publicacion"
            fullWidth
            disableUnderline
            readOnly
            onClick={() => setIsOpen(true)}
            sx={{
              ml: 2,
              backgroundColor: "#f0f2f5",
              color: "#94979a",
              px: 1.5,
              py: 0.5,
              borderRadius: 8,
              cursor: "pointer !important",
            }}
          />
        </Box>
        <Box
          component="div"
          display="flex"
          sx={{
            p: 1.5,
          }}
          alignItems="center"
          justifyContent="start"
        >
          <Button
            startIcon={<PermMediaIcon />}
            sx={{
              backgroundColor: "white",
              color: "#696b6f",
              ":hover": {
                backgroundColor: "lightgray",
              },
            }}
            onClick={() => setIsOpen(true)}
          >
            Foto/Video
          </Button>
        </Box>
        <CreatePublicationModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </Paper>
    </>
  );
};
