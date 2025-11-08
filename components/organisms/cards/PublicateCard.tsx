import {
  Avatar,
  Box,
  Button,
  Input,
  Paper,
  SxProps,
  Theme,
} from "@mui/material";
import { useContext, useState } from "react";
import { useTranslations } from "next-intl";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { CreatePublicationModal } from "../";
import { PostContext } from "../../../context/post";
import { v4 as uuidv4 } from "uuid";
import { Post } from "../../../interfaces/post";

interface Props {
  userProfileImage?: string;
  sx?: SxProps<Theme>;
  onPostCreated?: (newPost: Post) => void;
}

export const PublicateCard = ({ userProfileImage, sx = [], onPostCreated }: Props) => {
  const t = useTranslations("Publication");

  const { setPostId, removePostId } = useContext(PostContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenModal = async () => {
    const postId = uuidv4();
    setPostId(postId);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    removePostId();
    setIsOpen(false);
  };

  return (
    <>
      <Paper
        sx={[
          {
            width: "100%",
            maxWidth: 530,
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
          <Avatar
            src={userProfileImage ?? "/images/user-placeholder.png"}
            alt="user profile image"
          />
          <Input
            placeholder="Crear publicacion"
            fullWidth
            disableUnderline
            readOnly
            onClick={() => handleOpenModal()}
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
            onClick={() => handleOpenModal()}
          >
            Foto/Video
          </Button>
        </Box>
        <CreatePublicationModal
          open={isOpen}
          onClose={() => handleCloseModal()}
          onPostCreated={onPostCreated}
        />
      </Paper>
    </>
  );
};
