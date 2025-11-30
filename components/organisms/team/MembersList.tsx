import { FC } from "react";
import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  Box,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";

interface Member {
  id: number | string;
  name: string;
  username: string;
  avatar: string;
  role?: string;
  position?: string;
  joinDate?: string;
}

interface Props {
  members: Member[];
  title: string;
  captainLabel: string;
  formatSince: (dateIso?: string) => string;
}

export const MembersList: FC<Props> = ({
  members,
  title,
  captainLabel,
  formatSince,
}) => {
  const theme = useTheme();

  if (members.length === 0) {
    return (
      <>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: { xs: 2, md: 3 } }}
        >
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 4 },
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
          }}
        >
          <PersonIcon
            sx={{
              fontSize: { xs: 48, md: 64 },
              color: theme.palette.text.secondary,
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          >
            No hay miembros en este equipo
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
          }}
        >
          {title}
        </Typography>
      </Stack>
      <List sx={{ p: 0 }}>
        {members.map((member, index) => (
          <ListItem
            key={member.id}
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: { xs: 1.5, md: 2 },
              mb: { xs: 1.5, md: 2 },
              p: { xs: 1.5, sm: 2 },
              transition: "all 0.2s ease-in-out",
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderColor: alpha(theme.palette.primary.main, 0.3),
                transform: "translateX(4px)",
                boxShadow: `0 2px 8px ${alpha(
                  theme.palette.primary.main,
                  0.1
                )}`,
              },
            }}
          >
            <ListItemAvatar
              sx={{
                minWidth: { xs: 56, sm: 64, md: 72 },
                mr: { xs: 1.5, sm: 2 },
              }}
            >
              <Avatar
                src={member.avatar}
                alt={member.name}
                sx={{
                  width: { xs: 56, sm: 64, md: 72 },
                  height: { xs: 56, sm: 64, md: 72 },
                  border: {
                    xs: `2px solid ${theme.palette.primary.main}`,
                    md: `3px solid ${theme.palette.primary.main}`,
                  },
                  boxShadow: `0 0 0 ${alpha(theme.palette.primary.main, 0.2)}`,
                  transition: "all 0.2s ease-in-out",
                }}
              />
            </ListItemAvatar>
            <ListItemText
              disableTypography
              sx={{ flex: 1, minWidth: 0 }}
              primary={
                <Stack
                  direction="row"
                  spacing={{ xs: 0.75, sm: 1 }}
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ mb: { xs: 0.5, sm: 0.75 } }}
                >
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {member.name}
                  </Typography>
                  {member.role === "Capitán" && (
                    <Chip
                      icon={
                        <StarIcon
                          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                        />
                      }
                      label={captainLabel}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.warning.main,
                        color: theme.palette.getContrastText(
                          theme.palette.warning.main
                        ),
                        fontWeight: 600,
                        height: { xs: 22, sm: 24 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        "& .MuiChip-icon": {
                          marginLeft: { xs: "4px", md: "6px" },
                        },
                      }}
                    />
                  )}
                </Stack>
              }
              secondary={
                <Stack spacing={{ xs: 0.25, sm: 0.5 }} sx={{ mt: 0.5 }}>
                  <Typography
                    sx={{
                      color: theme.palette.info.main,
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    @{member.username}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    {member.position && (
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                        }}
                      >
                        {member.position}
                      </Typography>
                    )}
                    {member.position && member.joinDate && (
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                        }}
                      >
                        •
                      </Typography>
                    )}
                    {member.joinDate && (
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.8rem",
                            md: "0.85rem",
                          },
                        }}
                      >
                        {formatSince(member.joinDate)}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default MembersList;
