import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  IconButtonProps,
  ImageList,
  ImageListItem,
  Input,
  Skeleton,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";

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
import { SettingsMenu } from "../../../molecules/SettingsMenu/SettingsMenu";
import { MediaViewerModal } from "../../modals/MediaViewerModal";
import { useRouter } from "next/router";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { formatTimeElapsed } from "../../../../utils/formatTimeElapsed";

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
  likesQuantity,
  commentsQuantity,
  sharesQuantity,
}: Post) => {
  const t = useTranslations("Publication");
  const timeT = useTranslations("Time");

  const timeTranslations = {
    timePrefixText: timeT("timePrefixText"),
    timeYearsSuffixText: timeT("timeYearsSuffixText"),
    timeYearSuffixText: timeT("timeYearSuffixText"),
    timeMonthsSuffixText: timeT("timeMonthsSuffixText"),
    timeMonthSuffixText: timeT("timeMonthSuffixText"),
    timeWeeksSuffixText: timeT("timeWeeksSuffixText"),
    timeWeekSuffixText: timeT("timeWeekSuffixText"),
    timeDaysSuffixText: timeT("timeDaysSuffixText"),
    timeDaySuffixText: timeT("timeDaySuffixText"),
    timeHoursSuffixText: timeT("timeHoursSuffixText"),
    timeHourSuffixText: timeT("timeHourSuffixText"),
    timeMinutesSuffixText: timeT("timeMinutesSuffixText"),
    timeMinuteSuffixText: timeT("timeMinuteSuffixText"),
    timeSecondsSuffixText: timeT("timeSecondsSuffixText"),
    timeSecondSuffixText: timeT("timeSecondSuffixText"),
  };

  const matches = useMediaQuery("(min-width:650px)");

  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

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

  const handleCloseMediaViewer = () => {
    setMediaViewerOpen(false);
  };

  const handleMediaClick = (index: number) => {
    setSelectedMediaIndex(index);
    setMediaViewerOpen(true);
  };

  const handleNavigateToProfile = (username: string) => {
    router.push(`/profile/${username}`);
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
          width: "100%",
          maxWidth: 530,
          height: "100%",
          transition: "width 0.5s ease, height 0.5s ease",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={urlProfileImage}
              alt="Profile Picture"
              sx={{ cursor: "pointer" }}
              onClick={() => handleNavigateToProfile(username)}
            />
          }
          action={isLoggedUser && <SettingsMenu postId={id} />}
          title={
            <Typography
              variant="subtitle1"
              sx={{ cursor: "pointer" }}
              onClick={() => handleNavigateToProfile(username)}
            >
              {username}
            </Typography>
          }
          subheader={formatTimeElapsed(new Date(createdAt), timeTranslations)}
        />
        <CardContent sx={{ paddingBottom: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {body}
          </Typography>

          <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
          >
            {
              resources && resources.length > 0 ? (
                resources.length > 1 ? (
                  // Case 1: Multiple resources - show ImageList
                  <ImageList
                    sx={{ width: { xs: "100%", md: 500 }, maxHeight: 450 }}
                    cols={matches ? 3 : 2}
                    rowHeight={164}
                  >
                    {resources
                      .slice(0, Math.min(matches ? 6 : 4, resources.length))
                      .map((mediaItem, index) => (
                        <ImageListItem
                          key={index}
                          onClick={() => handleMediaClick(index)}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            ...(index === (matches ? 5 : 3) &&
                              resources.length > (matches ? 6 : 4) && {
                                "&::after": {
                                  content: `"+${
                                    resources.length - (matches ? 6 : 4)
                                  }"`,
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "1.5rem",
                                  fontWeight: "bold",
                                  borderRadius: "6px",
                                  zIndex: 1,
                                },
                              }),
                          }}
                        >
                          <Image
                            src={mediaItem.url || ""}
                            alt={`Image ${index + 1}`}
                            layout="fill"
                            style={{
                              borderRadius: "6px",
                              objectFit: "cover",
                              maxWidth: matches ? 164 : 300,
                              maxHeight: 164,
                            }}
                          />
                        </ImageListItem>
                      ))}
                  </ImageList>
                ) : // Case 2: Single resource - show CardMedia
                resources[0]?.url ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      marginTop: 2,
                      display: "flex",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleMediaClick(0)}
                  >
                    {resources[0].type === "video" ? (
                      <video
                        controls
                        src={resources[0].url}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "12px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <img
                        src={resources[0].url}
                        alt="Post image"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "5px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </Box>
                ) : null
              ) : null /* Case 3: No resources - show nothing */
            }
          </Box>
        </CardContent>

        {sharedPost && (
          <Box sx={{ paddingX: 2 }}>
            <SharedPostCard {...sharedPost} />{" "}
          </Box>
        )}

        {(likesQuantity > 0 || sharesQuantity > 0 || commentsQuantity > 0) && (
          <Box
            component={"div"}
            sx={{
              paddingX: 2,
              paddingY: 1,
              display: "flex",
              justifyContent:
                likesQuantity === 0 && sharesQuantity === 0
                  ? "end"
                  : likesQuantity > 0 &&
                    sharesQuantity > 0 &&
                    commentsQuantity === 0
                  ? "start"
                  : "space-between",
            }}
          >
            <Box
              sx={{
                paddingX: 2,
                paddingY: 1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {likesQuantity > 0 && (
                <Button>
                  <FavoriteIcon color="red" />
                  <Typography>{likesQuantity}</Typography>
                </Button>
              )}
              {sharesQuantity > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <ShareIcon />
                  <Typography>{sharesQuantity}</Typography>
                </Box>
              )}
            </Box>
            {commentsQuantity > 0 && (
              <Button variant="text">
                <Typography>{commentsQuantity}</Typography>
              </Button>
            )}
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
                      {formatTimeElapsed(new Date(createdAt), timeTranslations)}
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
      <MediaViewerModal
        ariaLabel="Post media viewer"
        open={mediaViewerOpen}
        onClose={handleCloseMediaViewer}
        allMedia={resources || []}
        initialIndex={selectedMediaIndex}
      />
      <CreatePublicationModal
        sharePost={{
          id,
          body,
          createdAt,
          username,
          resources,
          urlProfileImage,
          likesQuantity,
          commentsQuantity,
          sharesQuantity,
        }}
        open={isModalOpen}
        onClose={() => handleCloseModal()}
      />
    </>
  );
};
