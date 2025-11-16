"use client";

import NextLink from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  alpha,
  Link,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export function CTA() {
  const theme = useTheme();
  const t = useTranslations("Landing.cta");
  const router = useRouter();

  return (
    <Box component="section" sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.info.main} 100%)`,
            borderRadius: 4,
            p: { xs: 6, md: 10 },
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
                mb: 3,
                color: "white",
              }}
            >
              {t("title")}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha("#ffffff", 0.9),
                mb: 4,
                maxWidth: 700,
                mx: "auto",
              }}
            >
              {t("subtitle")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => router.push("/auth/register")}
                sx={{
                  bgcolor: "background.default",
                  color: "text.primary",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.background.default, 0.9),
                  },
                }}
              >
                {t("createAccount")}
              </Button>
              <NextLink href="/home" passHref>
                <Link component="span" sx={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: alpha("#ffffff", 0.1),
                      },
                    }}
                  >
                    {t("exploreCommunities")}
                  </Button>
                </Link>
              </NextLink>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
