import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";

import { PublicationCard } from "../../components/organisms";
import { Post } from "../../interfaces";
import { MainLayout } from "../../layouts";
import { useContext } from "react";
import { postService } from "../../services/post.service";
import { UserContext } from "../../context/user";
import { Box } from "@mui/material";

interface Props {
  post: Post;
}

const PostPage: NextPage<Props> = ({ post }) => {
  const t = useTranslations("Profile");

  const { user } = useContext(UserContext);

  return (
    <>
      <MainLayout
        pageDescription={`${post.username}'s post detail page.`}
        title={`${t("post")} - ${post.username}`}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: { xs: 2, md: 4 },
            mx: 2,
            transition: "margin 0.3s ease-in-out",
          }}
        >
          <PublicationCard {...post} maxWidth={700} />
        </Box>
      </MainLayout>
    </>
  );
};

export default PostPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  req,
}: GetServerSidePropsContext) => {
  const { post = "" } = params as { post: string };
  const serverToken = req.cookies["token"];

  if (!post) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  try {
    // Fetch user data with the server token
    const postFound = await postService.getPostById(post, serverToken);

    if (!postFound) {
      console.log("Post not found:", postFound);
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    return {
      props: {
        post: postFound,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  } catch (error) {
    console.error("Error fetching post data:", error);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};
