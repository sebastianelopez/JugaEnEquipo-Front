import { Box } from "@mui/material";
import type { GetStaticPropsContext, NextPage } from "next";
import { HomeLayout } from "../layouts";
import { HomeHeader, HomeNews, SliderText } from "../components/organisms";

const Home: NextPage = (props) => {
  console.log(props);
  return (
    <HomeLayout
      title={"Juga en Equipo"}
      pageDescription={"Encuentra a tu equipo ideal"}
    >
      <HomeHeader />
      <MovingWords
        words={["Juega", "Compite", "Disfruta", "Comparte", "Desafiate"]}
      />
      <InfiniteCarousel
        images={[
          lolLogo.src,
          counterstrikeLogo.src,
          heroesofthestormLogo.src,
          overwatchLogo.src,
          valorantLogo.src,
        ]}
      />

      {/**Contenido */}
      
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
