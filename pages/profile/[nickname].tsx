import { Button, Grid, Paper, Typography } from "@mui/material";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getUserByNickname } from "../../api";
import { ProfileCard, PublicationCard } from "../../components/organisms";
import { User } from "../../interfaces";
import { MainLayout } from "../../layouts";
import { usersMock } from "../../api/mock";

interface Props {
  userFound: User;
}

const ProfilePage: NextPage<Props> = ({ userFound }) => {
  const t = useTranslations("Profile");

  return (
    <>
      <MainLayout
        pageDescription={`${userFound.name}'s profile page with all his information.`}
        title={`${t("profile")} - ${userFound.name}`}
      >
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid
            item
            xs={12}
            position="relative"
            display={{ xs: "none", sm: "none", md: "inherit" }}
          >
            <Image
              src="https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg"
              width={1500}
              height="300"
              objectFit="fill"
            />
            <Button
              children="Compartir perfil"
              sx={{
                position: "absolute",
                bottom: 25,
                right: 25,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              xs={12}
              columns={{ xs: 4, sm: 8, md: 12 }}
              position="relative"
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={5}
                position="relative"
                display="flex"
                flexDirection={"column"}
                justifyContent="start"
                alignItems="center"
                mt={-20}
              >
                <ProfileCard user={userFound} />
                <Paper
                  sx={{
                    p: 2,
                    mt: 3,
                    top: 600,
                    maxWidth: 400,
                  }}
                >
                  <Typography fontWeight="bold" my={3}>
                    ABOUT
                  </Typography>
                  <Typography>
                    Soy un apasionado jugador de E-Games con años de experiencia
                    en el mundo de los videojuegos. Me encanta competir y
                    desafiarme a mí mismo en diferentes juegos, y he tenido la
                    oportunidad de participar en varios torneos importantes en
                    mi carrera. Mis especialidades son los juegos de estrategia
                    y los juegos de disparos en primera persona, y me encanta
                    pasar tiempo investigando y mejorando mis habilidades en
                    diferentes juegos.¡Estoy emocionado de seguir creciendo y
                    mejorando como jugador y espero enfrentarme a algunos de
                    ustedes en el campo de batalla virtual pronto!
                  </Typography>
                </Paper>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={7}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
                position="relative"
              >
                <PublicationCard
                  user={usersMock.users[0]}
                  media={[
                    "https://www.muylinux.com/wp-content/uploads/2021/11/Steam.jpg",
                    "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/blt038029114fe902a4/632128d5e7bdcf0dd996c989/Action.jpg",
                    "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/blt038029114fe902a4/632128d5e7bdcf0dd996c989/Action.jpg",
                  ]}
                  copy={"Alta publicacion amigo"}
                  comments={[
                    {
                      comment: "genial",
                      date: "Hace 1 minuto",
                      user: usersMock.users[1],
                    },
                  ]}
                  date={"Hace 3 minutos"}
                />
                <PublicationCard
                  user={usersMock.users[0]}
                  media={[
                    "https://www.muylinux.com/wp-content/uploads/2021/11/Steam.jpg",
                    "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/blt038029114fe902a4/632128d5e7bdcf0dd996c989/Action.jpg",
                    "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/blt038029114fe902a4/632128d5e7bdcf0dd996c989/Action.jpg",
                  ]}
                  copy={"Alta publicacion amigo"}
                  comments={[
                    {
                      comment: "genial",
                      date: "Hace 1 minuto",
                      user: usersMock.users[1],
                    },
                  ]}
                  date={"Hace 3 minutos"}
                />
              </Grid>
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
}: GetServerSidePropsContext) => {
  const { nickname = "" } = params as { nickname: string };

  const userFound = await getUserByNickname(nickname);

  if (!userFound) {
    return {
      redirect: {
        destination: "/",
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
};
