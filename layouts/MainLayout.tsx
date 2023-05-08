import Head from "next/head";
import { FC, PropsWithChildren } from "react";
import { MainNavbar, SideMenu } from "../components/organisms";


interface Props extends PropsWithChildren {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const MainLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}) => {
  return (
    <div
      style={{
               
      }}
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>
      <nav>
        <MainNavbar />
      </nav>
      
      {/* <SideMenu /> */}
      <SideMenu />

      <main
        style={{
          margin: "0px auto 0px auto",
          maxWidth: "1440px",
          padding: "0px 30px",          
        }}
      >
        {children}
      </main>
      <footer></footer>
    </div>
  );
};
