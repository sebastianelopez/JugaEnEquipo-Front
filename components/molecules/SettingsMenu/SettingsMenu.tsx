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

      if (typeof window !== "undefined") {
        const postDeletedEvent = new CustomEvent("postDeleted", {
          detail: { postId },
        });
        window.dispatchEvent(postDeletedEvent);
      }
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
          {t("deletePostTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("deletePostConfirmation")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined">
            {t("cancel")}
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
