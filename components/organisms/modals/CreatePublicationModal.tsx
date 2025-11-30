import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Input,
  Modal,
  SxProps,
  Theme,
  Typography,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";
import { SetStateAction, useContext, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import CloseIcon from "@mui/icons-material/Close";
import { PostContext } from "../../../context/post";
import { UserContext } from "../../../context/user";
import { Post } from "../../../interfaces";
import { SharedPostCard } from "../cards/SharedPostCard";
import { v4 as uuidv4 } from "uuid";
import { postService } from "../../../services/post.service";
import { useFeedback } from "../../../hooks/useFeedback";

interface Props {
  sx?: SxProps<Theme>;
  open: boolean;
  onClose: (value: SetStateAction<boolean>) => void;
  sharePost?: Post;
  onPostCreated?: (newPost: Post) => void;
}

export const CreatePublicationModal = ({
  sx = [],
  open,
  onClose,
  sharePost,
  onPostCreated,
}: Props) => {
  const t = useTranslations("Publication");
  const { showError } = useFeedback();
  const theme = useTheme();

  const { postId } = useContext(PostContext);
  const { user } = useContext(UserContext);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [postContent, setPostContent] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);

      const maxSize = 100 * 1024 * 1024; // 100MB (increased for videos)
      const oversizedFiles = filesArray.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map((f) => f.name).join(", ");
        showError({
          title: t("uploadErrorTitle"),
          message: t("uploadErrorOversizedFiles", { files: fileNames }),
        });
        return;
      }

      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearState = () => {
    setSelectedFiles([]);
    setPostContent("");
    setIsCreating(false);
  };

  const handleClose = () => {
    clearState();
    onClose(false);
  };

  const handleSubmit = async () => {
    if (postId === undefined || !user) return;

    setIsCreating(true);

    try {
      const postData: {
        body: string;
        files?: File[];
        sharedPostId?: string | null;
      } = {
        body: postContent,
        ...(selectedFiles.length > 0 && { files: selectedFiles }),
        sharedPostId: sharePost ? sharePost.id : null,
      };
      const response = await postService.createPost(postId, postData);

      console.log("Post created successfully:", response);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const optimisticPost: Post = {
        id: postId,
        body: postContent,
        username: user.username,
        createdAt: new Date().toISOString(),
        urlProfileImage: user.profileImage || null,
        resources: selectedFiles.map((file) => ({
          id: uuidv4(),
          url: URL.createObjectURL(file),
          type: file.type.startsWith("video/") ? "video" : "image",
        })),
        sharedPost: sharePost || null,
        likesQuantity: 0,
        sharesQuantity: 0,
        commentsQuantity: 0,
        hasLiked: false,
        hasShared: false,
      };

      if (onPostCreated) {
        onPostCreated(optimisticPost);
      }

      handleClose();
    } catch (error: any) {
      console.error("Error creating post:", error);

      let errorMessage = t("createPostErrorGeneric");

      if (error?.response?.status === 500) {
        errorMessage = t("createPostErrorServerError");
      } else if (error?.response?.status === 413) {
        errorMessage = t("createPostErrorContentTooLarge");
      } else if (error?.code === "ERR_NETWORK") {
        errorMessage = t("createPostErrorNetwork");
      }

      showError({
        title: t("createPostErrorTitle"),
        message: errorMessage,
        onRetry: handleSubmit,
        retryLabel: t("retry"),
      });

      setIsCreating(false);
      // Don't close on error, let user try again
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
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
            maxWidth: 550,
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: { xs: 1.5, md: 2 } }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                color: "text.primary",
              }}
            >
              {t("createPost")}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PermMediaIcon />}
              fullWidth={true}
              sx={{
                mb: 1,
                fontSize: { xs: "0.875rem", md: "1rem" },
                py: { xs: 1, md: 0.75 },
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              {t("mediaButton")}
              <input
                type="file"
                hidden
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </Button>
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: "0.7rem", md: "0.75rem" },
                color: "text.secondary",
                fontStyle: "italic",
                display: "block",
              }}
            >
              {t("mediaButtonHint")}
            </Typography>
          </Box>

          {selectedFiles.length > 0 && (
            <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
              <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                {selectedFiles.map((file, index) => (
                  <Grid size={{ xs: 6, sm: 6, md: 4 }} key={index}>
                    <Box
                      sx={{
                        position: "relative",
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        overflow: "hidden",
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                      }}
                    >
                      {file.type.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected file ${index}`}
                          style={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                          }}
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video
                          src={URL.createObjectURL(file)}
                          controls
                          style={{ width: "100%", height: 150 }}
                        />
                      ) : (
                        <Box sx={{ p: 2, color: "text.primary" }}>
                          {file.name}
                        </Box>
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          backgroundColor: alpha(
                            theme.palette.common.black,
                            0.6
                          ),
                          color: "common.white",
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.common.black,
                              0.8
                            ),
                          },
                        }}
                        onClick={() => removeFile(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: { xs: 1.5, md: 2 } }} />
          <Input
            placeholder={t("writeSomething")}
            multiline
            rows={4}
            fullWidth
            sx={{
              mt: { xs: 1, md: 2 },
              fontSize: { xs: "0.875rem", md: "1rem" },
              color: "text.primary",
              "&::before": {
                borderColor: "divider",
              },
              "&:hover:not(.Mui-disabled)::before": {
                borderColor: "primary.main",
              },
              "&::after": {
                borderColor: "primary.main",
              },
            }}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />

          {sharePost && (
            <Box sx={{ mt: { xs: 1.5, md: 2 } }}>
              <SharedPostCard {...sharePost} />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: { xs: 1.5, md: 2 },
              mb: { xs: 1, md: 0 },
              py: { xs: 1.25, md: 0.75 },
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontWeight: 600,
            }}
            onClick={handleSubmit}
            disabled={
              (!postContent.trim() && selectedFiles.length === 0) || isCreating
            }
          >
            {isCreating
              ? t("creating", { defaultMessage: "Creando..." })
              : t("createPost")}
          </Button>
        </Box>
      </Modal>
    </>
  );
};
