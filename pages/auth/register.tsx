import { GetStaticPropsContext } from "next";
import { RegisterForm } from "../../components/organisms";
import { AuthLayout } from "../../layouts";

const RegisterPage = () => {
  return (
    <>
      <AuthLayout title={"Register"}>
        <RegisterForm />
      </AuthLayout>
    </>
  );
};

export default RegisterPage;


export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
      props: {
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  }