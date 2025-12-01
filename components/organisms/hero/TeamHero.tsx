import { FC } from "react";
import {
  Box,
  Container,
  Button,
  Stack,
  Avatar,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import { useTheme } from "@mui/material/styles";

interface Props {
  banner: string;
  logo: string;
  name: string;
  foundedLabel: string; // already resolved (e.g., t("founded", {year}))
  region: string;
  backLabel: string;
  onBack: () => void;
  showEditButton?: boolean;
  onEdit?: () => void;
  isCreator?: boolean;
  isLeader?: boolean;
  creatorLabel?: string;
  leaderLabel?: string;
}

export const TeamHero: FC<Props> = ({
  banner,
  logo,
  name,
  foundedLabel,
  region,
  backLabel,
  onBack,
  showEditButton = false,
  onEdit,
  isCreator = false,
  isLeader = false,
  creatorLabel = "Creador",
  leaderLabel = "Líder",
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "280px", sm: "300px", md: "350px" },
        backgroundImage: `linear-gradient(to bottom, rgba(15, 15, 30, 0.3), rgba(15, 15, 30, 0.9)), url(${banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ pb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          size="small"
          sx={{
            color: theme.palette.common.white,
            mb: { xs: 1.5, md: 2 },
            fontSize: { xs: "0.875rem", md: "1rem" },
            minWidth: "auto",
            px: { xs: 1, md: 2 },
            "&:hover": { bgcolor: "rgba(108, 92, 231, 0.1)" },
            "& .MuiButton-startIcon": {
              marginRight: { xs: 0.5, md: 1 },
            },
          }}
        >
          {backLabel}
        </Button>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Avatar
            src={logo}
            alt={name}
            sx={{
              width: { xs: 70, sm: 90, md: 120 },
              height: { xs: 70, sm: 90, md: 120 },
              border: {
                xs: `3px solid ${theme.palette.primary.main}`,
                md: `4px solid ${theme.palette.primary.main}`,
              },
              boxShadow: `0 0 20px ${theme.palette.primary.main}80`,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: { xs: 1, md: 1 } }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.common.white,
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {name}
              </Typography>
              {showEditButton && onEdit && (
                <IconButton
                  onClick={onEdit}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: theme.palette.common.white,
                    width: { xs: 32, md: 40 },
                    height: { xs: 32, md: 40 },
                    flexShrink: 0,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    },
                    "& svg": {
                      fontSize: { xs: "1.1rem", md: "1.5rem" },
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Stack>
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 1.5, md: 2 }}
              flexWrap="wrap"
              gap={{ xs: 0.75, sm: 1 }}
            >
              <Chip
                icon={
                  <StarIcon
                    sx={{ fontSize: { xs: "0.875rem", md: "1.25rem" } }}
                  />
                }
                label={foundedLabel}
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                  height: { xs: 24, sm: 28, md: 32 },
                  "& .MuiChip-icon": {
                    marginLeft: { xs: "4px", md: "8px" },
                  },
                }}
              />
              <Chip
                label={region}
                size="small"
                sx={{
                  bgcolor: theme.palette.info.main,
                  color: theme.palette.getContrastText(theme.palette.info.main),
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                  height: { xs: 24, sm: 28, md: 32 },
                }}
              />
              {isCreator && (
                <Chip
                  icon={
                    <PersonIcon
                      sx={{ fontSize: { xs: "0.875rem", md: "1.25rem" } }}
                    />
                  }
                  label={creatorLabel}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.warning.main,
                    color: theme.palette.getContrastText(
                      theme.palette.warning.main
                    ),
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    height: { xs: 24, sm: 28, md: 32 },
                    "& .MuiChip-icon": {
                      marginLeft: { xs: "4px", md: "8px" },
                    },
                  }}
                />
              )}
              {isLeader && !isCreator && (
                <Chip
                  icon={
                    <MilitaryTechIcon
                      sx={{ fontSize: { xs: "0.875rem", md: "1.25rem" } }}
                    />
                  }
                  label={leaderLabel}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.success.main,
                    color: theme.palette.getContrastText(
                      theme.palette.success.main
                    ),
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    height: { xs: 24, sm: 28, md: 32 },
                    "& .MuiChip-icon": {
                      marginLeft: { xs: "4px", md: "8px" },
                    },
                  }}
                />
              )}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default TeamHero;
