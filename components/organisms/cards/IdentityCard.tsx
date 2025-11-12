import { Avatar, Paper, Typography } from "@mui/material";
import { FC } from "react";
import { useRouter } from "next/router";
import { User } from "../../../interfaces";
import { formatFullName } from "../../../utils/textFormatting";

interface Props {
  user: User;
}

export const IdentityCard: FC<Props> = ({ user }) => {
  const router = useRouter();

  const handleAvatarClick = () => {
    router.push(`/profile/${user.username}`);
  };

  return (
    <Paper
      sx={{
        p: 2,
        textAlign: "center",
        width: "100%",
        maxWidth: "250px",
        mb: 3,
        overflow: "visible",
      }}
    >
      <Avatar
        alt="Profile Picture"
        src={user.profileImage ?? "/images/user-placeholder.png"}
        onClick={handleAvatarClick}
        sx={{
          width: "100%",
          height: "auto",
          aspectRatio: "1/1",
          maxWidth: 200,
          maxHeight: 200,
          m: "auto",
          marginBottom: 1,
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
            transform: "scale(1.02)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      />
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
        }}
      >
        {user.username}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
        }}
      >
        {formatFullName(user.firstname, user.lastname)}
      </Typography>
    </Paper>
  );
};
