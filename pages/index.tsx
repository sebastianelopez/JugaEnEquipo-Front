import { Box } from "@mui/material";
import type { GetStaticPropsContext, NextPage } from "next";
import { HomeLayout } from "../layouts";
import { HomeHeader } from "../components/organisms";

const Home: NextPage = (props) => {
  console.log(props);
  return (
    <HomeLayout
      title={"Juga en Equipo"}
      pageDescription={"Encuentra a tu equipo ideal"}
    >
      <HomeHeader />

      
    </HomeLayout>
  );
};

export default Home;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../lang/${locale}.json`)).default,
    },
  };
}
