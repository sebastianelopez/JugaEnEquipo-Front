import { Box } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { LoginForm } from "../../components/organisms";
import { AuthLayout } from "../../layouts";

const LoginPage = () => {
  return (
    <>
      <AuthLayout title={"Login"}>
        <Box component="div">
          <LoginForm />
        </Box>        
      </AuthLayout>
    </>
  );
};

export default LoginPage;


export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
      props: {
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  }