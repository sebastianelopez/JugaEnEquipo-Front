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
import { FeedbackContext } from "../../../../../context/feedback";
import { useTranslations } from "next-intl";

import { v4 as uuidv4 } from "uuid";
import { postService } from "../../../../../services/post.service";
import { useTimeTranslations } from "../../../../../hooks/useTimeTranslations";

export interface CommentSectionHandle {
  focus: (onFocus: () => void) => void;
}

interface Props {
  postId: string;
  expanded: boolean;
}

export const CommentSection = forwardRef<CommentSectionHandle, Props>(
  ({ postId, expanded }, ref) => {
    const { user } = useContext(UserContext);
    const { showError } = useContext(FeedbackContext);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentId, setNewCommentId] = useState<string | null>(null);
    const [commentInput, setCommentInput] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [loading, setLoading] = useState(false);

    const t = useTranslations("Publication");

    const timeTranslations = useTimeTranslations();

    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
      focus: (onFocus: () => void) => {
        onFocus();
        setTimeout(() => inputRef.current?.focus(), 100);
      },
    }));

    const handleSubmitComment = async (
      e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent
    ) => {
      e.preventDefault();

      if (!commentInput.trim() || submittingComment || !user) return;

      const commentText = commentInput.trim();
      setSubmittingComment(true);

      setCommentInput("");

      try {
        const commentId = uuidv4();

        await postService.addComment(postId, {
          commentId: commentId,
          commentBody: commentText,
        });

        const localComment: Comment = {
          id: commentId,
          user: user.username,
          comment: commentText,
          createdAt: new Date().toISOString(),
        };

        setComments((prev) => [...prev, localComment]);
        setNewCommentId(commentId);

        setTimeout(() => {
          setNewCommentId(null);
        }, 1000);
      } catch (error: any) {
        setCommentInput(commentText);

        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Error al enviar el comentario";
        showError({
          title: "Error",
          message: errorMessage,
          onRetry: () => {
            setCommentInput(commentText);
          },
          retryLabel: "Reintentar",
        });
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
                      paddingX: 2,
                      marginBottom: 1,
                      width: "100%",
                      animation: isNewComment
                        ? "fadeSlideIn 0.5s ease-out"
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
                        paddingY: 1,
                        paddingX: 1.5,
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
              value={commentInput}
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
