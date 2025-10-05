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
import { useState, useCallback } from "react";
import { postService } from "../../../services/post.service";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useFeedback } from "../../../hooks/useFeedback";

interface SettingsMenuProps {
  postId: string;
}

export const SettingsMenu = ({ postId }: SettingsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const t = useTranslations("Publication");
  const { showError, showSuccess } = useFeedback();

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setAnchorEl(null);
    setOpenConfirmDialog(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setOpenConfirmDialog(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await postService.deletePost(postId);
      setOpenConfirmDialog(false);
      showSuccess({
        title: t("deletePostSuccessTitle"),
        message: t("deletePostSuccessMessage"),
        closeLabel: t("close"),
      });
      // TODO: refresh the posts list after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      setOpenConfirmDialog(false);
      showError({
        title: t("deletePostErrorTitle"),
        message: t("deletePostErrorMessage"),
        onRetry: () => setOpenConfirmDialog(true),
        retryLabel: t("retry"),
      });
    }
  }, [postId, showError, showSuccess, t]);

  return (
    <>
      <IconButton aria-label="settings" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleDeleteClick}>{t("deletePost")}</MenuItem>
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
