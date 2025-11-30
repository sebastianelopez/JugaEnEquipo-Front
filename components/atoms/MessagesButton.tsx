import { Badge, IconButton } from "@mui/material";
import { useContext } from "react";
import MessageIcon from "@mui/icons-material/Message";
import { useRouter } from "next/router";
import { NotificationContext } from "../../context/notification";

interface Props {}

export const MessagesButton = ({}: Props) => {
  const router = useRouter();
  const { unreadChatCount } = useContext(NotificationContext);

  const handleClick = () => {
    router.push("/messages");
  };

  return (
    <IconButton aria-label="messages" onClick={handleClick}>
      <Badge
        badgeContent={unreadChatCount}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "#ffa599",
            color: "black",
          },
        }}
        invisible={unreadChatCount === 0}
      >
        <MessageIcon />
      </Badge>
    </IconButton>
  );
};
