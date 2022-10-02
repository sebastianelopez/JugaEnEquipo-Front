import { Typography } from "@mui/material";
import type { GetStaticPropsContext, NextPage } from "next";
import { HomeLayout } from "../layouts";
import { useTranslations } from "next-intl";

const Home: NextPage = () => {
  const t = useTranslations("Home");

  return (
    <HomeLayout
      title={"Juga en Equipo"}
      pageDescription={"Encuentra a tu equipo ideal"}
    >
      <Typography variant="h1" component={"h1"} textAlign="center"
      fontSize={60}>
        {t("title")}
      </Typography>
    </HomeLayout>
  );
};

export default Home;

// pages/index.js
export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../lang/${locale}.json`)).default,
    },
  };
}
