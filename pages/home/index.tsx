import { GetStaticPropsContext } from "next";
import { Publication } from "../../components/organisms/publication/Publication";
import { MainLayout } from "../../layouts/MainLayout";

const userMock = {
  name: "Carlos Romero",
  email: "carlosromero@gmail.com",
  profileImage:
    "https://media-exp1.licdn.com/dms/image/C4D03AQGcZkggqz819A/profile-displayphoto-shrink_200_200/0/1644242636295?e=1671667200&v=beta&t=VwnFzRsmqGJcm87qw8hfLP_fIMVALcu0pcWwCYDMPG8",
};

const HomePage = () => {
  return (
    <MainLayout title={"Home"} pageDescription={""}>
      <Publication
        user={userMock}
        media={"https://www.muylinux.com/wp-content/uploads/2021/11/Steam.jpg"}
        copy={"Alta publicacion amigo"}
        comments={[{comment:'genial', date: 'Hace 1 minuto', user: userMock }]}
        date={'Hace 3 minutos'}
      />
    </MainLayout>
  );
};

export default HomePage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
}

