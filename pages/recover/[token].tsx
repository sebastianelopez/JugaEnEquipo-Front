import { alpha, Box, Container, useTheme } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { ResetPasswordForm } from "../../components/organisms/form/ResetPasswordForm";
import { AuthLayout } from "../../layouts";

const ResetPasswordPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { token } = router.query;

  if (!router.isReady) {
    return (
      <>
        <AuthLayout title={"Reset Password"}>
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
                )} 0%, ${alpha(
                  theme.palette.secondary.main,
                  0.05
                )} 50%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
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
              <Box sx={{ textAlign: "center" }}>Loading...</Box>
            </Container>
          </Box>
        </AuthLayout>
      </>
    );
  }

  if (!token || typeof token !== "string") {
    return (
      <>
        <AuthLayout title={"Reset Password"}>
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
                )} 0%, ${alpha(
                  theme.palette.secondary.main,
                  0.05
                )} 50%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
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
              <Box sx={{ textAlign: "center", color: "error.main" }}>
                Invalid or missing token
              </Box>
            </Container>
          </Box>
        </AuthLayout>
      </>
    );
  }

  return (
    <>
      <AuthLayout title={"Reset Password"}>
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
            <ResetPasswordForm token={token} />
          </Container>
        </Box>
      </AuthLayout>
    </>
  );
};

export default ResetPasswordPage;

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../lang/${locale || "en"}.json`)).default,
    },
  };
}
