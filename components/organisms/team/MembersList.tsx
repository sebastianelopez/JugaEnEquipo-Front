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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ color: theme.palette.text.primary, fontWeight: 700 }}
        >
          {title}
        </Typography>
      </Stack>
      <List>
        {members.map((member) => (
          <ListItem
            key={member.id}
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              mb: 2,
              p: 2,
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={member.avatar}
                alt={member.name}
                sx={{
                  width: 56,
                  height: 56,
                  border: `2px solid ${theme.palette.primary.main}`,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              disableTypography
              sx={{ ml: 2 }}
              primary={
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                    }}
                  >
                    {member.name}
                  </Typography>
                  {member.role === "Capitán" && (
                    <Chip
                      label={captainLabel}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.warning.main,
                        color: theme.palette.getContrastText(
                          theme.palette.warning.main
                        ),
                        fontWeight: 600,
                        height: 20,
                      }}
                    />
                  )}
                </Stack>
              }
              secondary={
                <div>
                  <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                    <Typography
                      sx={{
                        color: theme.palette.info.main,
                        fontSize: "0.9rem",
                      }}
                    >
                      @{member.username}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.85rem",
                      }}
                    >
                      {member.position} • {formatSince(member.joinDate)}
                    </Typography>
                  </Stack>
                </div>
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default MembersList;
