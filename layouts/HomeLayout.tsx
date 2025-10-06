import Head from "next/head";
import { FC, PropsWithChildren } from "react";

import { HomeNavbar } from "../components/organisms/navbar/HomeNavbar";
import { Footer } from "../components/organisms/footer/Footer";

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

      <main>{children}</main>
      <Footer />
    </>
  );
};
