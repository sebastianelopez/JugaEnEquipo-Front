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
      }}
    >
      <Avatar
        alt="Profile Picture"
        src={user.profileImage}
        sx={{ width: 200, height: 200, m: "auto", marginBottom: 1 }}
      />
      <Typography variant="h4" fontWeight="bold">
        {user.username}
      </Typography>
      <Typography variant="subtitle1">{`${user.firstname} ${user.lastname}`}</Typography>
    </Paper>
  );
};
