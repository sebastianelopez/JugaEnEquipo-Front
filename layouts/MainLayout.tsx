import Head from "next/head";
import { FC, PropsWithChildren, useEffect } from "react";
import { MainNavbar, SideMenu } from "../components/organisms";
import { Box } from "@mui/material";

interface Props extends PropsWithChildren {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
  fillViewport?: boolean;
}

export const MainLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
  fillViewport,
}) => {
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`
    );

    const handleResize = () => {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: fillViewport ? "100vh" : "none",
        overflow: fillViewport ? "hidden" : "visible",
      }}
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>

      <MainNavbar />

      {/* <SideMenu /> */}
      <SideMenu />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginX: "auto",
          padding: "0 30px",
          width: "100vw",
        }}
      >
        {children}
      </Box>
      <footer></footer>
    </Box>
  );
};
