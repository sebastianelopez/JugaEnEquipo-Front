import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { useTranslations } from "next-intl";
import { getUserByNickname } from "../../api";
import { TournamentTable } from "../../components/organisms";
import { User } from "../../interfaces";
import { MainLayout } from "../../layouts";

interface Props {
  userFound: User;
}

const TournamentsPage: NextPage<Props> = ({ userFound }) => {
  const t = useTranslations("Tournaments");

  return (
    <>
      <MainLayout
        pageDescription={`Tournaments page`}
        title={`${t("tournaments")}`}
      >
        <TournamentTable
          tournaments={[
            {
              type: "Oficial",
              name: "El torneo mas piola",
              registeredTeams: 47,
              maxTeams: 50,
              game: { _id: "1231", name: "Overwatch", isVisible: true },
            },
          ]}
        />
      </MainLayout>
    </>
  );
};

export default TournamentsPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}: GetServerSidePropsContext) => {
  return {
    props: {
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
};
