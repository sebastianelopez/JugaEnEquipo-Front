import { FC } from "react";
import {
  Box,
  Container,
  Button,
  Stack,
  Avatar,
  Typography,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import { useTheme } from "@mui/material/styles";

interface Props {
  banner: string;
  logo: string;
  name: string;
  foundedLabel: string; // already resolved (e.g., t("founded", {year}))
  region: string;
  backLabel: string;
  onBack: () => void;
}

export const TeamHero: FC<Props> = ({
  banner,
  logo,
  name,
  foundedLabel,
  region,
  backLabel,
  onBack,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "250px", md: "350px" },
        backgroundImage: `linear-gradient(to bottom, rgba(15, 15, 30, 0.3), rgba(15, 15, 30, 0.9)), url(${banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            color: theme.palette.common.white,
            mb: 2,
            "&:hover": { bgcolor: "rgba(108, 92, 231, 0.1)" },
          }}
        >
          {backLabel}
        </Button>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Avatar
            src={logo}
            alt={name}
            sx={{
              width: { xs: 80, md: 120 },
              height: { xs: 80, md: 120 },
              border: `4px solid ${theme.palette.primary.main}`,
              boxShadow: `0 0 20px ${theme.palette.primary.main}80`,
            }}
          />
          <Box>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.common.white,
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 1,
              }}
            >
              {name}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
              <Chip
                icon={<StarIcon />}
                label={foundedLabel}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                }}
              />
              <Chip
                label={region}
                sx={{
                  bgcolor: theme.palette.info.main,
                  color: theme.palette.getContrastText(theme.palette.info.main),
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default TeamHero;
