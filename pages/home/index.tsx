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
import { PostList } from "../../components/molecules/PostList";

const HomePage = () => {
  const { user } = useContext(UserContext);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await postService.getMyFeed();
        const postsArray = Array.isArray(fetchedPosts)
          ? fetchedPosts
          : [fetchedPosts];

        const postsWithTimestamps = postsArray.map((post) => ({
          ...post,
          timestamp: new Date(post.createdAt).getTime(),
        }));

        postsWithTimestamps.sort((a, b) => b.timestamp - a.timestamp);
        const sortedPosts = postsWithTimestamps;

        setPosts(sortedPosts);
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
          <PostList isLoading={isLoading} posts={posts} />
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
