import { GetStaticPropsContext } from "next";
import { RegisterForm } from "../../components/organisms";
import { AuthLayout } from "../../layouts";
import { alpha, Box, Container, useTheme } from "@mui/material";

const RegisterPage = () => {
  const theme = useTheme();

  return (
    <>
      <AuthLayout title={"Register"}>
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            py: 4,
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 50%, ${alpha(
                theme.palette.info.main,
                0.1
              )} 100%)`,
              zIndex: 1,
            }}
          />
          <Container
            maxWidth="sm"
            sx={{
              position: "relative",
              zIndex: 2,
            }}
          >
            <RegisterForm />
          </Container>
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
