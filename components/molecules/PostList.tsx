import { Box, Typography, Skeleton } from "@mui/material";
import { PublicationCard } from "../organisms";
import { Post } from "../../interfaces";

interface Props {
  posts: Post[];
  isLoading: boolean;
}

export const PostList = ({ posts, isLoading }: Props) => {
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

      {/* No Posts State */}
      {!isLoading && posts.length === 0 && (
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
            No hay publicaciones para mostrar
          </Typography>
        </Box>
      )}

      {/* Posts Exist State */}
      {!isLoading &&
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
