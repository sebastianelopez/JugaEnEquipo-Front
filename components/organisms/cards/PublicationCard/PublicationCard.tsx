import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  IconButtonProps,
  ImageList,
  ImageListItem,
  Input,
  Menu,
  MenuItem,
  Skeleton,
  styled,
  Typography,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LikeButton } from "../../../atoms";
import { Post } from "../../../../interfaces/post";
import Image from "next/image";
import { postService } from "../../../../services/post.service";
import { Comment } from "../../../../interfaces/comment";
import { SharedPostCard } from "../SharedPostCard";
import { UserContext } from "../../../../context/user";
import { CreatePublicationModal } from "../../modals/CreatePublicationModal";
import { PostContext } from "../../../../context/post";
import { v4 as uuidv4 } from "uuid";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const PublicationCard = ({
  id,
  body,
  createdAt,
  username,
  resources,
  sharedPost,
  urlProfileImage,
}: Post) => {

  const t = useTranslations("Publication");

  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useContext(UserContext);

  const isLoggedUser = user?.username === username;

  const inputRef = useRef<HTMLInputElement>();

  const { setPostId, removePostId } = useContext(PostContext);

  const handleOpenModal = async () => {
    const postId = uuidv4();
    setPostId(postId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    removePostId();
    setIsModalOpen(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentClick = () => {
    setExpanded(true);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const loadComments = async () => {
      if (expanded && !loading) {
        setLoading(true);
        try {
          const fetchedComments = await postService.getPostComments(id);
          setComments(
            Array.isArray(fetchedComments) ? fetchedComments : [fetchedComments]
          );
        } catch (error) {
          console.error("Error cargando comentarios:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (expanded) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, id]);

  return (
    <>
      <Card
        sx={{
          width: { xs: "100%", md: 530 },
          transition: "width 0.5s ease, height 0.5s ease",
        }}
      >
        <CardHeader
          avatar={<Avatar src={urlProfileImage} alt="Profile Picture" />}
          action={isLoggedUser && <SettingsMenu postId={id} />}
          title={username}
          subheader={createdAt}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {body}
          </Typography>

          {
            resources && resources.length > 0 ? (
              resources.length > 1 ? (
                // Case 1: Multiple resources - show ImageList
                <ImageList
                  sx={{ width: { xs: "100%", md: 500 }, maxHeight: 450 }}
                  cols={3}
                  rowHeight={164}
                >
                  {resources.map((mediaItem, index) => (
                    <ImageListItem key={index}>
                      <Image
                        src={mediaItem.url || ""}
                        alt={`Image ${index + 1}`}
                        width={164}
                        height={164}
                        style={{ borderRadius: "6px" }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : // Case 2: Single resource - show CardMedia
              resources[0]?.url ? (
                <CardMedia
                  image={resources[0].url}
                  sx={{
                    width: { xs: 350, sm: 425, md: 500 },
                    height: { xs: 315, sm: 383, md: 450 },
                    transition: "width 0.5s ease, height 0.5s ease",
                    marginTop: 5,
                    borderRadius: 1.5,
                  }}
                  title="Post image"
                />
              ) : null
            ) : null /* Case 3: No resources - show nothing */
          }
        </CardContent>

        {sharedPost && (
          <Box sx={{ paddingX: 2 }}>
            <SharedPostCard {...sharedPost} />{" "}
          </Box>
        )}

        <CardActions disableSpacing>
          <IconButton aria-label="like" onClick={handleCommentClick}>
            <AddCommentRoundedIcon />
          </IconButton>
          <LikeButton />
          <IconButton aria-label="share" onClick={handleOpenModal}>
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            component={"div"}
            sx={{
              transition: "opacity 0.5s ease-out",
              opacity: expanded ? 1 : 0,
            }}
          >
            <Box component={"div"}>
              {loading ? (
                <CardContent>
                  <Skeleton variant="text" width="10%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="30%" />
                </CardContent>
              ) : comments.length > 0 ? (
                comments.map(({ id, comment, user, createdAt }) => (
                  <CardContent key={id}>
                    <Typography variant="subtitle2">{user}</Typography>
                    <Typography variant="body2">{comment}</Typography>
                    <Typography variant="caption" alignSelf={"end"}>
                      {createdAt}
                    </Typography>
                  </CardContent>
                ))
              ) : (
                <>
                  <Typography variant="subtitle2" align="center">
                    No comments yet
                  </Typography>
                  <Typography variant="body2" align="center">
                    Add a comment
                  </Typography>
                </>
              )}
            </Box>
            <Box paddingX={2} paddingY={2} component={"div"}>
              <Input fullWidth placeholder={t("comment")} inputRef={inputRef} />
            </Box>
          </Box>
        </Collapse>
      </Card>
      <CreatePublicationModal
        sharePost={{
          id,
          body,
          createdAt,
          username,
          resources,
          urlProfileImage,
        }}
        open={isModalOpen}
        onClose={() => handleCloseModal()}
      />
    </>
  );
};

interface SettingsMenuProps {
  postId: string;
}

const SettingsMenu = ({ postId }: SettingsMenuProps) => {
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
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
