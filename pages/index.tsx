import { Box } from "@mui/material";
import type { GetStaticPropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";
import { HomeLayout } from "../layouts";
import { MobileAppPromotion } from "../components/three";
import { HomeHero } from "../components/organisms/hero/HomeHero";
import { Features, Community, Stats, CTA } from "../components/organisms";

import mobileBackground from "../assets/mobile-background.png";

const Home: NextPage = (props) => {
  console.log(props);
  const t = useTranslations("MobileApp");

  const handleDownloadApp = () => {
    // TODO: Implementar lógica de descarga o redirección a la tienda
    console.log("Descargar app móvil");
  };

  return (
    <HomeLayout
      title={"Juga en Equipo"}
      pageDescription={"Encuentra a tu equipo ideal"}
    >
      <HomeHero />

      {/* Stats Section */}
      <Stats />

      {/* Features Section */}
      <Features />

      {/* Mobile App Promotion Section */}
      <Box sx={{ mt: 8, mb: 8, px: { xs: 2, md: 4 } }}>
        <MobileAppPromotion
          screenImage={mobileBackground.src}
          title={t("title")}
          description={t("description")}
          ctaText={t("ctaText")}
          onCtaClick={handleDownloadApp}
          showStars={false}
        />
      </Box>

      {/* Community Section */}
      <Community />

      {/* Call to Action Section */}
      <CTA />
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
