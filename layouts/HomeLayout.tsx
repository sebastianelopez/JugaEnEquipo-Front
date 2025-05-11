import Head from "next/head";
import { FC, PropsWithChildren } from "react";
import { Footer, HomeNavbar } from "../components/organisms";

interface Props extends PropsWithChildren {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const HomeLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>

      <HomeNavbar />

      <main
        style={{
          margin: "60px auto",
          padding: "0px 30px 0px 30px",
          backgroundColor: "#f5f5f5",
        }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};
