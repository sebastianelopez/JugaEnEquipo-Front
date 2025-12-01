import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Box,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useRouter } from "next/router";

interface TeamItem {
  id: string | number;
  name: string;
  logo?: string;
  role?: string;
  position?: string;
  joinDate?: string | number | Date;
  leftDate?: string | number | Date;
}

interface TeamsListProps {
  teams: TeamItem[];
}

export const TeamsList = ({ teams }: TeamsListProps) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <List>
      {teams.map((team) => (
        <ListItem
          key={team.id}
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            mb: 2,
            p: 2,
            cursor: "pointer",
            transition: "all 0.3s ease",
            ":hover": {
              transform: "translateX(8px)",
              boxShadow: `0 4px 12px ${alpha(
                theme.palette.primary.main,
                0.25
              )}`,
            },
          }}
          onClick={() => router.push(`/teams/${team.id}`)}
        >
          <ListItemAvatar>
            <Avatar
              src={team.logo}
              alt={team.name}
              sx={{
                width: 56,
                height: 56,
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
          </ListItemAvatar>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: 0.5 }}
            >
              <Typography
                component="span"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {team.name}
              </Typography>
              {team.role === "Creador" && (
                <Chip
                  label="Creador"
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 600, height: 20 }}
                />
              )}
              {team.role === "Líder" && (
                <Chip
                  label="Líder"
                  size="small"
                  color="warning"
                  sx={{ fontWeight: 600, height: 20 }}
                />
              )}
              {team.role === "Miembro" && (
                <Chip
                  label="Miembro"
                  size="small"
                  color="info"
                  sx={{ fontWeight: 600, height: 20 }}
                />
              )}
              {team.leftDate && (
                <Chip
                  label="Anterior"
                  size="small"
                  sx={{
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    height: 20,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
              )}
            </Stack>
            <Box sx={{ mt: 0.5 }}>
              {team.position && (
                <Typography
                  component="span"
                  sx={{
                    color: theme.palette.info.main,
                    fontSize: "0.9rem",
                    display: "block",
                  }}
                >
                  {team.position}
                </Typography>
              )}
              <Typography
                component="span"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.85rem",
                  display: "block",
                }}
              >
                {team.leftDate
                  ? `${new Date(
                      team.joinDate || ""
                    ).toLocaleDateString()} - ${new Date(
                      team.leftDate
                    ).toLocaleDateString()}`
                  : team.joinDate
                  ? `Desde ${new Date(team.joinDate).toLocaleDateString()}`
                  : null}
              </Typography>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};
