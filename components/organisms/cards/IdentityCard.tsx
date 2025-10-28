import { Avatar, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { User } from "../../../interfaces";

interface Props {
  user: User;
}

export const IdentityCard: FC<Props> = ({ user }) => {
  const t = useTranslations("Publication");
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
        sx={{
          width: "100%",
          height: "auto",
          aspectRatio: "1/1",
          maxWidth: 200,
          maxHeight: 200,
          m: "auto",
          marginBottom: 1,
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
        {`${user.firstname} ${user.lastname}`}
      </Typography>
    </Paper>
  );
};
