import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { GetStaticPropsContext } from "next";
import {
  IdentityCard,
  HashtagsCard,
  PublicateCard,
  UpcomingEventsCard,
} from "../../components/organisms";
import { MainLayout } from "../../layouts";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/user";
import { postService } from "../../services/post.service";
import { Post } from "../../interfaces/post";
import { PostList } from "../../components/molecules/Post/PostList";
import { NewPostsAvailable } from "../../components/molecules/Post/NewPostsAvailable";
import { sortPostsByDate } from "../../utils/sortPosts";

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
  const [hasError, setHasError] = useState(false);
  const lastUpdateTimestamp = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const limit = isDesktop ? 10 : 6;
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

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
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedPosts = [...newPostsAvailable.posts, ...posts];
      const sortedPosts = sortPostsByDate(updatedPosts);
      setPosts(sortedPosts);

      setNewPostsAvailable({ hasNew: false, count: 0, posts: [] });
      lastUpdateTimestamp.current = Date.now();
    } catch (error) {
      console.error("Error loading new posts:", error);
    } finally {
      setIsLoadingNewPosts(false);
    }
  };

  const loadInitialPosts = useCallback(async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      const result = await postService.getMyFeed({ limit, offset: 0 });
      if (result.error || !result.data) {
        setHasError(true);
        setPosts([]);
        return;
      }
      const postsArray = result.data;
      const sortedPosts = sortPostsByDate(postsArray);
      setPosts(sortedPosts);
      setOffset(sortedPosts.length);
      setHasMore(sortedPosts.length === limit);
    } catch (error) {
      console.error("Error loading posts:", error);
      setHasError(true);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    try {
      setIsLoadingMore(true);
      const result = await postService.getMyFeed({ limit, offset });
      if (result.error || !result.data) {
        setHasMore(false);
        return;
      }
      const newPosts = result.data;

      const sortedNewPosts = sortPostsByDate(newPosts);
      setPosts((prev) => {
        const allPosts = [...prev, ...sortedNewPosts];

        return sortPostsByDate(allPosts);
      });
      setOffset((prev) => prev + sortedNewPosts.length);
      setHasMore(sortedNewPosts.length === limit);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMore, limit, offset]);

  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasUserScrolled) return;
            loadMorePosts();
          }
        });
      },
      { root: null, rootMargin: "0px 0px 1200px 0px", threshold: 0.1 }
    );

    observer.observe(target);
    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [loadMorePosts, hasUserScrolled]);

  useEffect(() => {
    const onScroll = () => {
      if (
        !hasUserScrolled &&
        typeof window !== "undefined" &&
        window.scrollY > 50
      ) {
        setHasUserScrolled(true);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", onScroll);
      }
    };
  }, [hasUserScrolled]);

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
      <Grid container spacing={4}>
        <Grid
          size={{ md: 3 }}
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
          size={{ xs: 12, md: 6 }}
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          position="relative"
          sx={{ marginX: { xs: 3, md: "auto" } }}
        >
          <PublicateCard userProfileImage={user?.profileImage} />
          {newPostsAvailable.hasNew && (
            <NewPostsAvailable
              newPostsCount={newPostsAvailable.count}
              onLoadNewPosts={handleLoadNewPosts}
              isLoading={isLoadingNewPosts}
            />
          )}
          <PostList
            isLoading={isLoading}
            posts={posts}
            error={hasError}
            onRetry={loadInitialPosts}
          />
          <div ref={sentinelRef} style={{ height: 1 }} />
        </Grid>
        <Grid
          size={{ md: 3 }}
          position="relative"
          justifyContent="start"
          alignItems="start"
          flexDirection="column"
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
          <UpcomingEventsCard />
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
