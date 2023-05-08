import {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetStaticPropsContext,
    NextPage,
  } from "next";
  import { useTranslations } from "next-intl";
  import { getUserByNickname } from "../../api";
  import { User } from "../../interfaces";
  import { MainLayout } from "../../layouts";
  
  interface Props {
    userFound: User;
  }
  
  const TournamentsPage: NextPage<Props> = ({ userFound }) => {
  
    const t = useTranslations("Tournaments");
  
  
    return (
      <>
        <MainLayout pageDescription={`Tournaments page`} title={`${t("tournaments")}`}></MainLayout>
      </>
    );
  };
  
  export default TournamentsPage;
  
  export const getServerSideProps: GetServerSideProps = async ({
    params,
    locale,
  }: GetServerSidePropsContext) => {
    const { nickname = "" } = params as { nickname: string };
  
    const userFound = await getUserByNickname(nickname);
  
    if (!userFound) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  
    return {
      props: {
        userFound,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  };
  