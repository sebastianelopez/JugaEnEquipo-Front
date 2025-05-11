import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import {
  PublicationCard,
  IdentityCard,
  HashtagsCard,
  PublicateCard,
} from "../../components/organisms";
import { MainLayout } from "../../layouts";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/user";
import { postService } from "../../services/post.service";
import { Post } from "../../interfaces/post";

const HomePage = () => {
  const { user } = useContext(UserContext);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await postService.getMyFeed();
        setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : [fetchedPosts]);
      } catch (error) {
        console.error("Error loading posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <MainLayout title={"Home"} pageDescription={""}>
      <Grid
        container
        columns={12}
        sx={{
          mt: 12,
          display: "flex",
          mx: "auto",
          width: "100%",
          justifyContent: "center",
          // Ensure the Grid spans the full width
        }}
      >
        <Grid
          md={3}
          position="relative"
          justifyContent="start"
          alignItems="end"
          flexDirection="column"
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
          {user && <IdentityCard user={user} />}
          <HashtagsCard
            hashtags={[
              "Overwatch",
              "CS",
              "KRU",
              "Kun Aguero",
              "LOL",
              "Kings Row",
              "Winston",
              "Steam",
              "OWTournament",
            ]}
          />
        </Grid>
        <Grid
          display="flex"
          xs={12}
          md={6}
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          position="relative"
          sx={{
            marginX: { xs: 3, md: "none" },
          }}
        >
          <PublicateCard />
          {/* Loading State */}
          {isLoading && (
            <>
              {[1, 2, 3].map((item) => (
                <Box
                  key={`skeleton-${item}`}
                  component="div"
                  sx={{
                    mb: 3,
                    width: { xs: "100%", md: 530 },
                    maxWidth: { xs: 530 },
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
                width: { xs: "100%", md: 530 },
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
                  mb: 3,
                }}
              >
                <PublicationCard {...post} />
              </Box>
            ))}
        </Grid>
        <Grid
          md={3}
          position="relative"
          justifyContent="start"
          alignItems="start"
          flexDirection="column"
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
          {user && <IdentityCard user={user} />}
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default HomePage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
}
