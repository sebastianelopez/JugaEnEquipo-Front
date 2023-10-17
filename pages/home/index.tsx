import { Box, Grid } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { usersMock } from "../../api/mock";
import {
  PublicationCard,
  IdentityCard,
  HashtagsCard,
  PublicateCard,
} from "../../components/organisms";
import { MainLayout } from "../../layouts";

const HomePage = () => {
  return (
    <MainLayout title={"Home"} pageDescription={""}>
      <Grid container columns={{ xs: 12, md: 12 }} sx={{ mt: 12 }}>
        <Grid
          item
          md={3}
          position="relative"
          justifyContent="start"
          alignItems="end"
          flexDirection="column"
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
          <IdentityCard user={usersMock.users[0]} />
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
          item
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
          <Box
            component="div"
            sx={{
              mb: 3,
            }}
          >
            <PublicationCard
              user={usersMock.users[0]}
              media={[
                "https://www.muylinux.com/wp-content/uploads/2021/11/Steam.jpg",
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
          </Box>
          {Array.from({ length: 8 }, (_, i) => (
            <Box
              component="div"
              key={i}
              sx={{
                mb: 3,
              }}
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
            </Box>
          ))}
        </Grid>
        <Grid
          item
          md={3}
          position="relative"
          justifyContent="start"
          alignItems="start"
          flexDirection="column"
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
          <IdentityCard user={usersMock.users[0]} />
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
