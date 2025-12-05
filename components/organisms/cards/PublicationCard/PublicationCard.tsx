import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  IconButtonProps,
  ImageList,
  ImageListItem,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RepeatIcon from "@mui/icons-material/Repeat";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import { useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LikeButton } from "../../../atoms";
import { Post } from "../../../../interfaces/post";
import Image from "next/image";
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
import {
  CommentSection,
  CommentSectionHandle,
} from "./CommentSection/CommentSection";
import { postService } from "../../../../services/post.service";
import { parsePostText } from "../../../../utils/parsePostText";

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

interface PublicationCardProps extends Post {
  maxWidth?: number;
  onPostCreated?: (newPost: Post) => void;
}

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
  hasLiked,
  hasShared,
  maxWidth,
  onPostCreated,
}: PublicationCardProps) => {
  const timeT = useTranslations("Time");
  const publicationT = useTranslations("Publication");

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
  const isSmallScreen = useMediaQuery("(max-width:480px)");
  const theme = useTheme();

  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [currentIsLiked, setCurrentIsLiked] = useState(hasLiked);
  const [currentLikesQuantity, setCurrentLikesQuantity] =
    useState(likesQuantity);

  const { user } = useContext(UserContext);

  const isLoggedUser = user?.username === username;

  const commentSectionRef = useRef<CommentSectionHandle>(null);

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

  const handleCloseMediaViewer = () => {
    setMediaViewerOpen(false);
  };

  const handleMediaClick = (index: number) => {
    setSelectedMediaIndex(index);
    setMediaViewerOpen(true);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentClick = () => {
    commentSectionRef.current?.focus(() => setExpanded(true));
  };

  const handleNavigateToProfile = (username: string) => {
    router.push(`/profile/${username}`);
  };

  useEffect(() => {
    setCurrentIsLiked(hasLiked);
  }, [hasLiked]);

  useEffect(() => {
    setCurrentLikesQuantity(likesQuantity);
  }, [likesQuantity]);

  const handleLikeClick = async () => {
    if (!user) return; // Don't allow liking if user is not logged in

    const previousIsLiked = currentIsLiked;
    const previousLikesQuantity = currentLikesQuantity;

    try {
      const newIsLiked = !currentIsLiked;
      setCurrentIsLiked(newIsLiked);

      const newLikesQuantity = newIsLiked
        ? currentLikesQuantity + 1
        : Math.max(0, currentLikesQuantity - 1);
      setCurrentLikesQuantity(newLikesQuantity);

      if (newIsLiked) {
        await postService.likePost(id);
      } else {
        await postService.dislikePost(id);
      }
    } catch (error) {
      console.error("Error handling like:", error);

      setCurrentIsLiked(previousIsLiked);
      setCurrentLikesQuantity(previousLikesQuantity);
    }
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          maxWidth: maxWidth ?? 530,
          height: "100%",
          transition: "width 0.5s ease, height 0.5s ease",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={urlProfileImage || undefined}
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
        <CardContent sx={{ paddingY: 0 }}>
          {body && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {parsePostText(body, theme)}
            </Typography>
          )}

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
                            fill
                            sizes="(max-width: 650px) 50vw, 164px"
                            style={{
                              borderRadius: "6px",
                              objectFit: "cover",
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

        {(currentLikesQuantity > 0 ||
          sharesQuantity > 0 ||
          commentsQuantity > 0) && (
          <Box
            component={"div"}
            sx={{
              paddingX: 2,
              paddingY: 0.5,
              display: "flex",
              justifyContent:
                currentLikesQuantity === 0 && sharesQuantity === 0
                  ? "end"
                  : currentLikesQuantity > 0 &&
                    sharesQuantity > 0 &&
                    commentsQuantity === 0
                  ? "start"
                  : "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              {currentLikesQuantity > 0 && (
                <Button
                  sx={{
                    minWidth: "auto",
                    paddingX: 0.5,
                    paddingY: 0.25,
                    "& .MuiButton-startIcon": {
                      margin: 0,
                      marginRight: 0.5,
                    },
                  }}
                  size="small"
                >
                  <FavoriteIcon sx={{ color: "#E17055", fontSize: "1rem" }} />
                  <Typography variant="caption">
                    {currentLikesQuantity}
                  </Typography>
                </Button>
              )}
              {sharesQuantity > 0 && (
                <Button
                  sx={{
                    minWidth: "auto",
                    paddingX: 0.5,
                    paddingY: 0.25,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                  size="small"
                >
                  <RepeatIcon sx={{ fontSize: "1rem" }} />
                  <Typography variant="caption">{sharesQuantity}</Typography>
                </Button>
              )}
            </Box>
            {commentsQuantity > 0 && (
              <Button
                variant="text"
                onClick={() => setExpanded(true)}
                size="small"
                sx={{
                  paddingX: 0.5,
                  paddingY: 0.25,
                }}
              >
                <Typography variant="caption">{`${commentsQuantity} comments`}</Typography>
              </Button>
            )}
          </Box>
        )}

        <CardActions disableSpacing sx={{ display: "flex", gap: 1 }}>
          <>
            <Button
              startIcon={<ChatBubbleOutlineIcon />}
              onClick={handleCommentClick}
              sx={{
                flex: 1,
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
              variant="text"
            >
              {!isSmallScreen && publicationT("commentButton")}
            </Button>
            <LikeButton
              onClick={handleLikeClick}
              isPressed={currentIsLiked}
              sx={{
                flex: 1,
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
              isSmallScreen={isSmallScreen}
            />
            <Button
              startIcon={<RepeatIcon />}
              onClick={handleOpenModal}
              sx={{
                flex: 1,
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
              variant="text"
            >
              {!isSmallScreen && publicationT("shareButton")}
            </Button>
          </>

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <CommentSection
          expanded={expanded}
          ref={commentSectionRef}
          postId={id}
        />
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
          sharedPost: null,
          likesQuantity: currentLikesQuantity,
          commentsQuantity,
          sharesQuantity,
          hasLiked: currentIsLiked,
          hasShared,
        }}
        open={isModalOpen}
        onClose={() => handleCloseModal()}
        onPostCreated={onPostCreated}
      />
    </>
  );
};
