import { alpha, Box, Container, useTheme } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { ForgotPasswordForm } from "../../components/organisms/form/ForgotPasswordForm";
import { AuthLayout } from "../../layouts";

const ForgotPasswordPage = () => {
  const theme = useTheme();

  return (
    <>
      <AuthLayout title={"Forgot Password"}>
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
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
            <ForgotPasswordForm />
          </Container>
        </Box>
      </AuthLayout>
    </>
  );
};

export default ForgotPasswordPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
}
