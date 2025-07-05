import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import {
  PublicationCard,
  IdentityCard,
  HashtagsCard,
  PublicateCard,
} from "../../components/organisms";
import { MainLayout } from "../../layouts";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/user";
import { postService } from "../../services/post.service";
import { Post } from "../../interfaces/post";
import { PostList } from "../../components/molecules/Post/PostList";
import { NewPostsAvailable } from "../../components/molecules/Post/NewPostsAvailable";

const HomePage = () => {
  const { user } = useContext(UserContext);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostsAvailable, setNewPostsAvailable] = useState<{
    hasNew: boolean;
    count: number;
    posts: Post[];
  }>({ hasNew: false, count: 0, posts: [] });
  const [isLoadingNewPosts, setIsLoadingNewPosts] = useState(false);
  const lastUpdateTimestamp = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkForNewPosts = async () => {
    try {
      const result = await postService.checkForNewPosts(
        lastUpdateTimestamp.current
      );

      if (result.hasNewPosts) {
        setNewPostsAvailable({
          hasNew: true,
          count: result.count,
          posts: result.posts,
        });
      }
    } catch (error) {
      console.error("Error checking for new posts:", error);
    }
  };

  const handleLoadNewPosts = async () => {
    setIsLoadingNewPosts(true);
    try {
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Agregar nuevos posts al inicio de la lista
      const updatedPosts = [...newPostsAvailable.posts, ...posts];
      setPosts(updatedPosts);

      // Resetear estado de nuevos posts
      setNewPostsAvailable({ hasNew: false, count: 0, posts: [] });
      lastUpdateTimestamp.current = Date.now();
    } catch (error) {
      console.error("Error loading new posts:", error);
    } finally {
      setIsLoadingNewPosts(false);
    }
  };

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

  useEffect(() => {
    if (!isLoading) {
      // Verificar nuevos posts cada 30 segundos
      intervalRef.current = setInterval(checkForNewPosts, 3000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <MainLayout title={"Home"} pageDescription={""}>
      <Grid
        container
        columns={12}
        sx={{
          display: "flex",
          mx: "auto",
          width: "100%",
          justifyContent: "center",
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
          <PublicateCard userProfileImage={user?.profileImage} />
          {newPostsAvailable.hasNew && (
            <NewPostsAvailable
              newPostsCount={newPostsAvailable.count}
              onLoadNewPosts={handleLoadNewPosts}
              isLoading={isLoadingNewPosts}
            />
          )}
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
