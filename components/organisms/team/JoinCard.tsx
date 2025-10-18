import { FC } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTheme } from "@mui/material/styles";

interface Props {
  title: string;
  membersCount: number;
  currentMembersLabel: string;
  requestJoinLabel: string;
  onRequestJoin?: () => void;
}

export const JoinCard: FC<Props> = ({
  title,
  membersCount,
  currentMembersLabel,
  requestJoinLabel,
  onRequestJoin,
}) => {
  const theme = useTheme();
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.common.white,
          fontWeight: 700,
          mb: 3,
          textAlign: "center",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          borderRadius: 2,
          p: 3,
          mb: 3,
          textAlign: "center",
        }}
      >
        <GroupsIcon
          sx={{ color: theme.palette.info.main, fontSize: "3rem", mb: 1 }}
        />
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.9rem",
            mb: 1,
          }}
        >
          {currentMembersLabel}
        </Typography>
        <Typography
          variant="h3"
          sx={{ color: theme.palette.info.main, fontWeight: 800 }}
        >
          {membersCount}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={<PersonAddIcon />}
        onClick={onRequestJoin}
      >
        {requestJoinLabel}
      </Button>
    </>
  );
};

export default JoinCard;
