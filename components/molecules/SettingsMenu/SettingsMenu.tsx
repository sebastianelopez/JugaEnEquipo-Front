import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { postService } from "../../../services/post.service";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface SettingsMenuProps {
  postId: string;
}

export const SettingsMenu = ({ postId }: SettingsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const t = useTranslations("Publication");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setAnchorEl(null);
    setOpenConfirmDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await postService.deletePost(postId);
      setOpenConfirmDialog(false);
      // TODO: add some feedback that post was deleted and refresh the posts list after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      // Handle error (maybe show an error message)
    }
  };

  return (
    <>
      <IconButton aria-label="settings" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleDeleteClick}>Eliminar publicacion</MenuItem>
      </Menu>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Eliminar publicación?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro que deseas eliminar esta publicación? Esta acción no
            se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
