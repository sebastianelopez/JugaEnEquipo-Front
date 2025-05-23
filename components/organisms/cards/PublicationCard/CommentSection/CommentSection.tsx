import {
  Collapse,
  Box,
  CardContent,
  Typography,
  Input,
  IconButton,
  Skeleton,
} from "@mui/material";
import { formatTimeElapsed } from "../../../../../utils/formatTimeElapsed";

import SendIcon from "@mui/icons-material/Send";
import { Comment } from "../../../../../interfaces/comment";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { UserContext } from "../../../../../context/user";
import { useTranslations } from "next-intl";

import { v4 as uuidv4 } from "uuid";
import { postService } from "../../../../../services/post.service";

export interface CommentSectionHandle {
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
  focus: () => void;
}

interface Props {
  postId: string;
}

export const CommentSection = forwardRef<CommentSectionHandle, Props>(
  ({ postId }, ref) => {
    const { user } = useContext(UserContext);
    const [expanded, setExpanded] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentId, setNewCommentId] = useState<string | null>(null);
    const [commentInput, setCommentInput] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const inputRef = useRef<HTMLInputElement>();

    useImperativeHandle(ref, () => ({
      expand: () => setExpanded(true),
      collapse: () => setExpanded(false),
      toggle: () => setExpanded((prev) => !prev),
      focus: () => {
        setExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      },
    }));

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const handleCommentClick = () => {
      setExpanded(true);
      inputRef.current?.focus();
    };

    const handleSubmitComment = async (
      e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent
    ) => {
      e.preventDefault();

      if (!commentInput.trim() || submittingComment || !user) return;

      setSubmittingComment(true);

      try {
        const commentId = uuidv4();
        const newComment = await postService.addComment(postId, {
          commentId: commentId,
          commentBody: commentInput,
        });

        if (!newComment) return;

        setComments((prev) => [...prev, newComment]);
        setNewCommentId(newComment.id);
        setCommentInput("");
        setTimeout(() => {
          setNewCommentId(null);
        }, 1000);
      } catch (error) {
        console.error("Error submitting comment:", error);
      } finally {
        setSubmittingComment(false);
      }
    };

    const handleCommentInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setCommentInput(e.target.value);
    };

    const handleCommentKeyPress = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {
        handleSubmitComment(e);
      }
    };

    useEffect(() => {
      const loadComments = async () => {
        if (expanded && !loading) {
          setLoading(true);
          try {
            const fetchedComments = await postService.getPostComments(postId);
            setComments(
              Array.isArray(fetchedComments)
                ? fetchedComments
                : [fetchedComments]
            );

            console.log("Fetched comments:", fetchedComments);
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
    }, [expanded, postId]);

    return (
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
              comments.map(({ id, comment, user: commentUser, createdAt }) => {
                const isCurrentUser = user?.username === commentUser;
                const isNewComment = id === newCommentId;

                return (
                  <Box
                    key={id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isCurrentUser ? "flex-end" : "flex-start",
                      padding: 2,
                      width: "100%",
                      opacity: isNewComment ? 0 : 1,
                      transform: isNewComment
                        ? "translateY(20px)"
                        : "translateY(0)",
                      animation: isNewComment
                        ? "fadeSlideIn 0.5s ease-out forwards"
                        : "none",
                      "@keyframes fadeSlideIn": {
                        "0%": {
                          opacity: 0,
                          transform: "translateY(20px)",
                        },
                        "100%": {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "70%",
                        backgroundColor: isCurrentUser
                          ? "primary.light"
                          : "red.50",
                        borderRadius: 2,
                        padding: 1.5,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color={isCurrentUser ? "white" : "text.primary"}
                      >
                        {commentUser}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={isCurrentUser ? "white" : "text.primary"}
                      >
                        {comment}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ px: 1 }}>
                      {formatTimeElapsed(new Date(createdAt), timeTranslations)}
                    </Typography>
                  </Box>
                );
              })
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
            <Input
              fullWidth
              placeholder={t("comment")}
              inputRef={inputRef}
              onChange={handleCommentInputChange}
              onKeyPress={handleCommentKeyPress}
              disabled={submittingComment}
              endAdornment={
                <IconButton
                  size="small"
                  onClick={handleSubmitComment}
                  disabled={!commentInput.trim() || submittingComment}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              }
            />
          </Box>
        </Box>
      </Collapse>
    );
  }
);
