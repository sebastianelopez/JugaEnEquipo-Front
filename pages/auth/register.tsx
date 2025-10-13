import { GetStaticPropsContext } from "next";
import { RegisterForm } from "../../components/organisms";
import { AuthLayout } from "../../layouts";
import { Box } from "@mui/material";

const RegisterPage = () => {
  return (
    <>
      <AuthLayout title={"Register"}>
        <Box component="div" sx={{ marginTop: "150px" }}>
          <RegisterForm />
        </Box>
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
