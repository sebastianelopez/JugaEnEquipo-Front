import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { Post } from "../../interfaces/post";
import { MainLayout } from "../../layouts";
import { postService } from "../../services/post.service";
import { PostList } from "../../components/molecules/Post/PostList";
import { sortPostsByDate } from "../../utils/sortPosts";
import { UserContext } from "../../context/user";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
  hashtag: string;
}

const HashtagPage: NextPage<Props> = ({ hashtag }) => {
  const t = useTranslations("Hashtag");
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const limit = 5;

  // Reset pagination state when hashtag changes
  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    setHasError(false);
    setHasUserScrolled(false);
    setIsLoadingMore(false);
  }, [hashtag]);

  const loadInitialPosts = useCallback(async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      const result = await postService.getPostsByHashtag(hashtag, {
        limit,
        offset: 0,
      });
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
  }, [hashtag, limit]);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore || !hasUserScrolled) return;
    try {
      setIsLoadingMore(true);
      const result = await postService.getPostsByHashtag(hashtag, {
        limit,
        offset,
      });
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
  }, [
    isLoading,
    isLoadingMore,
    hasMore,
    hasUserScrolled,
    limit,
    offset,
    hashtag,
  ]);

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
  }, [loadMorePosts]);

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

  const handleBackClick = () => {
    router.back();
  };

  return (
    <MainLayout
      title={`#${hashtag}`}
      pageDescription={`Posts with hashtag #${hashtag}`}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 700,
          mx: "auto",
          px: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            mb: 3,
            mt: { xs: 2, md: 4 },
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight="bold" sx={{ flex: 1 }}>
            #{hashtag}
          </Typography>
        </Box>

        <PostList
          isLoading={isLoading}
          posts={posts}
          error={hasError}
          onRetry={loadInitialPosts}
        />
        <div ref={sentinelRef} style={{ height: 1 }} />
      </Box>
    </MainLayout>
  );
};

export default HashtagPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}: GetServerSidePropsContext) => {
  const { hashtag = "" } = params as { hashtag: string };

  if (!hashtag) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      hashtag: decodeURIComponent(hashtag),
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
};
