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

  const { postId } = useContext(PostContext);
  const { user } = useContext(UserContext);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [postContent, setPostContent] = useState<string>("");
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [uploadedResources, setUploadedResources] = useState<
    Array<{ id: string; url: string; type: string }>
  >([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (postId === undefined) return;
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      setIsUploadingMedia(true);

      try {
        const newMediaIds: string[] = [];
        const uploadPromises = filesArray.map(async (file) => {
          const mediaId = uuidv4();
          newMediaIds.push(mediaId);
          const resourceType = file.type.startsWith("video/")
            ? "video"
            : "image";

          const response = await postService.addResource(postId, {
            id: mediaId,
            resource: file,
            type: resourceType,
          });

          return {
            id: mediaId,
            url: URL.createObjectURL(file),
            type: resourceType,
            response: response,
          };
        });

        const uploadedResults = await Promise.all(uploadPromises);

        setSelectedFiles((prev) => [...prev, ...filesArray]);
        setMediaIds((prev) => [...prev, ...newMediaIds]);
        setUploadedResources((prev) => [...prev, ...uploadedResults]);

        console.log("All resources uploaded successfully:", uploadedResults);
      } catch (error) {
        console.error("Error uploading resources:", error);
        // TODO - Show a notification here
      } finally {
        setIsUploadingMedia(false);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaIds((prev) => prev.filter((_, i) => i !== index));
    setUploadedResources((prev) => prev.filter((_, i) => i !== index));
  };

  const clearState = () => {
    setSelectedFiles([]);
    setMediaIds([]);
    setUploadedResources([]);
    setPostContent("");
  };

  const handleClose = () => {
    clearState();
    onClose(false);
  };

  const handleSubmit = async () => {
    if (postId === undefined || !user) return;

    setIsCreating(true);

    try {
      const response = await postService.createPost(postId, {
        body: postContent,
        resources: mediaIds,
        sharedPostId: sharePost ? sharePost.id : null,
      });

      console.log("Post created successfully:", response);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const optimisticPost: Post = {
        id: postId,
        body: postContent,
        username: user.username,
        createdAt: new Date().toISOString(),
        urlProfileImage: user.profileImage,
        resources: uploadedResources.map((resource) => ({
          id: resource.id,
          url: resource.url,
          type: resource.type as "image" | "video",
        })),
        sharedPost: sharePost || null,
        likesQuantity: 0,
        sharesQuantity: 0,
        commentsQuantity: 0,
      };

      if (onPostCreated) {
        onPostCreated(optimisticPost);
      }

      handleClose();
    } catch (error) {
      console.error("Error creating post:", error);

      // TODO - Show an error message
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
            maxWidth: 550,
            background: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 id="modal-title">{t("createPost")}</h2>

          <Button
            variant="outlined"
            component="label"
            startIcon={<PermMediaIcon />}
            sx={{ mb: 2 }}
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

          {selectedFiles.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1}>
                {selectedFiles.map((file, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Box
                      sx={{
                        position: "relative",
                        border: "1px solid #eee",
                        borderRadius: 1,
                        overflow: "hidden",
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
                        <Box sx={{ p: 2 }}>{file.name}</Box>
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.7)",
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

          <Divider />
          <Input
            placeholder={t("writeSomething")}
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 2 }}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />

          {sharePost && (
            <Box sx={{ mt: 2 }}>
              <SharedPostCard {...sharePost} />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={
              (!postContent.trim() && selectedFiles.length === 0) ||
              isCreating ||
              isUploadingMedia
            }
          >
            {isUploadingMedia
              ? t("uploadingMedia", {
                  defaultMessage: "Subiendo multimedia...",
                })
              : isCreating
              ? t("creating", { defaultMessage: "Creando..." })
              : t("createPost")}
          </Button>
        </Box>
      </Modal>
    </>
  );
};
