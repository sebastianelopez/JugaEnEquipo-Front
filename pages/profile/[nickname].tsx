import { Box, Button, Grid, Paper, Tab, Tabs, Typography } from "@mui/material";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ProfileCard } from "../../components/organisms";
import { Post, User } from "../../interfaces";
import { MainLayout } from "../../layouts";
import { userService } from "../../services/user.service";
import { useContext, useEffect, useState } from "react";
import { postService } from "../../services/post.service";
import { PostList } from "../../components/molecules/Post/PostList";
import { UserContext } from "../../context/user";
import { BlizzardButton } from "../../components/atoms";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Props {
  userFound: User;
}

const ProfilePage: NextPage<Props> = ({ userFound }) => {
  const t = useTranslations("Profile");

  const { user } = useContext(UserContext);

  const isLoggedUser = user?.username === userFound.username;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const CustomTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        sx={{
          width: "100%",
          maxWidth: 530,
        }}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </Box>
    );
  };

  const getA11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await postService.getPostsByUsername(
          userFound.username
        );
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
    <>
      <MainLayout
        pageDescription={`${userFound.firstname}'s profile page with all his information.`}
        title={`${t("profile")} - ${userFound.firstname}`}
      >
        <Grid xs={12} sm={12} md={12} lg={12} container>
          <Grid xs={12} sm={12} md={12} lg={12} container position="relative">
            <Image
              src="https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg"
              width={1500}
              height="300"
              objectFit="fill"
              alt="Background"
            />
            <Button
              sx={{
                position: "absolute",
                top: { xs: 85, md: "unset" },
                bottom: { xs: "unset", md: 25 },
                right: 25,
              }}
              variant="contained"
              color="primary"
            >
              {isLoggedUser ? t("editProfileBackground") : t("shareProfile")}
            </Button>
          </Grid>
          <Grid container spacing={3} sx={{ width: "100%", justifyContent: 'space-around' }}>
            <Grid
              item
              xs={12}
              md={5}
              position="relative"
              display="flex"
              flexDirection={"column"}
              justifyContent="start"
              alignItems="center"
              mt={{ xs: -10, md: -20 }}
            >
              <ProfileCard user={userFound} />
              <Paper
                sx={{
                  p: 2,
                  mt: 3,
                  top: 600,
                  width: "100%",
                  maxWidth: { xs: 530, md: 400 },
                }}
              >
                <Typography fontWeight="bold" my={3}>
                  ABOUT
                </Typography>
                <Typography>
                  Soy un apasionado jugador de E-Games con años de experiencia
                  en el mundo de los videojuegos. Me encanta competir y
                  desafiarme a mí mismo en diferentes juegos, y he tenido la
                  oportunidad de participar en varios torneos importantes en mi
                  carrera. Mis especialidades son los juegos de estrategia y los
                  juegos de disparos en primera persona, y me encanta pasar
                  tiempo investigando y mejorando mis habilidades en diferentes
                  juegos.¡Estoy emocionado de seguir creciendo y mejorando como
                  jugador y espero enfrentarme a algunos de ustedes en el campo
                  de batalla virtual pronto!
                </Typography>
              </Paper>
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                mt: { xs: 0, md: 3 },
              }}
              position="relative"
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tab}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Publicaciones" {...getA11yProps(0)} />
                  <Tab label="Stats" {...getA11yProps(1)} />
                  <Tab label="Item Three" {...getA11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={tab} index={0}>
                <PostList isLoading={isLoading} posts={posts} />
              </CustomTabPanel>
              <CustomTabPanel value={tab} index={1}>
                <BlizzardButton />
              </CustomTabPanel>
              <CustomTabPanel value={tab} index={2}>
                Item Three
              </CustomTabPanel>
            </Grid>
          </Grid>
        </Grid>
      </MainLayout>
    </>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  req,
}: GetServerSidePropsContext) => {
  const { nickname = "" } = params as { nickname: string };
  const serverToken = req.cookies["token"];

  if (!nickname) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  try {
    // Fetch user data with the server token
    const userFound = await userService.getUserByUsername(
      nickname,
      serverToken
    );

    if (!userFound) {
      console.log("User not found:", nickname);
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    return {
      props: {
        userFound,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};
