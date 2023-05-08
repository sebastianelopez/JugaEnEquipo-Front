import { Grid } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { usersMock } from "../../api/mock";
import { PublicationCard, IdentityCard } from "../../components/organisms";
import { MainLayout } from "../../layouts";

const HomePage = () => {
  return (
    <MainLayout title={"Home"} pageDescription={""}>
      <Grid container columns={{ xs: 12, md: 12 }} position="relative">
        <Grid item xs={3} md={3} position="relative">
          <IdentityCard user={usersMock.users[0]} />
        </Grid>
        <Grid
          display="flex"
          item
          xs={6}
          md={3}
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
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
        </Grid>
        <Grid item xs={3} md={3} position="relative">
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
