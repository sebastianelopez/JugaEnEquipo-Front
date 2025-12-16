import {
  Modal,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type { Team } from "../../../interfaces";

interface TeamMembersModalProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
}

export const TeamMembersModal = ({
  open,
  onClose,
  team,
}: TeamMembersModalProps) => {
  const theme = useTheme();
  const t = useTranslations("Tournaments");

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          border: `2px solid ${theme.palette.primary.main}`,
          width: { xs: "90%", sm: "500px" },
          maxHeight: "80vh",
          overflow: "auto",
          p: 4,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {team && (
              <>
                <Avatar
                  src={team.profileImage || team.logo || team.image}
                  alt={team.name}
                  sx={{ width: 48, height: 48 }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                  }}
                >
                  {team.name}
                </Typography>
              </>
            )}
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{ color: theme.palette.text.primary }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ bgcolor: theme.palette.secondary.dark, mb: 3 }} />

        <Typography
          variant="h6"
          sx={{ color: theme.palette.info.main, fontWeight: 600, mb: 2 }}
        >
          {t("detail.teamMembers")}
        </Typography>

        <List>
          {(team?.users || team?.members || []).map(
            (member: any, index: number) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: theme.palette.secondary.dark,
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={member.profileImage || member.avatar}
                    alt={member.username || member.name}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {member.username || member.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      sx={{
                        color: theme.palette.info.main,
                        fontSize: "0.85rem",
                      }}
                    >
                      {member.role || t("detail.member")}
                    </Typography>
                  }
                />
              </ListItem>
            )
          )}
        </List>
      </Box>
    </Modal>
  );
};

