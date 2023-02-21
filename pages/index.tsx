import { Box } from "@mui/material";
import type { GetStaticPropsContext, NextPage } from "next";
import { MainLayout } from "../layouts/MainLayout";
import Scene from "../components/three/Scene";

const Home: NextPage = () => {
  return (
    <MainLayout
      title={"Juga en Equipo"}
      pageDescription={"Encuentra a tu equipo ideal"}
    >
      <div style={{ height:"100vh", width:"100w"}}>
        <Scene />
      </div>
    </MainLayout>
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