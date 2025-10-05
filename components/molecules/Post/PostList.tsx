import { Box, Typography, Skeleton } from "@mui/material";
import { PublicationCard } from "../../organisms";
import { Post } from "../../../interfaces";
import { useTranslations } from "next-intl";
import { ErrorState } from "../Feedback/ErrorState";

interface Props {
  posts: Post[];
  isLoading: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export const PostList = ({ posts, isLoading, error, onRetry }: Props) => {
  const t = useTranslations("Feed");
  return (
    <>
      {isLoading && (
        <>
          {[1, 2, 3].map((item) => (
            <Box
              key={`skeleton-${item}`}
              component="div"
              sx={{
                mb: 3,
                width: "100%",
                maxWidth: 530,
              }}
            >
              <Skeleton variant="rectangular" height={60} />
              <Skeleton variant="rectangular" height={300} sx={{ mt: 1 }} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" />
                <Skeleton width="80%" />
                <Skeleton width="40%" />
              </Box>
            </Box>
          ))}
        </>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <ErrorState
          title={t("loadErrorTitle")}
          message={t("loadErrorMessage")}
          actionLabel={t("retry")}
          onRetry={onRetry}
          lottieAutoplay={true}
        />
      )}

      {/* No Posts State */}
      {!isLoading && !error && posts.length === 0 && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: "100%",
            maxWidth: 530,
            height: 200,
            border: "1px dashed grey",
            borderRadius: 2,
            mt: 4,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {t("noPosts")}
          </Typography>
        </Box>
      )}

      {/* Posts Exist State */}
      {!isLoading &&
        !error &&
        posts.length > 0 &&
        posts.map((post, index) => (
          <Box
            component="div"
            key={`post-${post.id || index}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
              mb: 3,
              width: "100%",
              maxWidth: 530,
            }}
          >
            <PublicationCard {...post} />
          </Box>
        ))}
    </>
  );
};
