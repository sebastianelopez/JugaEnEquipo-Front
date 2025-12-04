import { Badge, IconButton } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import { useRouter } from "next/router";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";

interface Props {}

export const MessagesButton = ({}: Props) => {
  const router = useRouter();
  const { totalUnreadMessages } = useUnreadMessages();

  const handleClick = () => {
    router.push("/messages");
  };

  return (
    <IconButton aria-label="messages" onClick={handleClick}>
      <Badge
        badgeContent={totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "#ffa599",
            color: "black",
          },
        }}
        invisible={totalUnreadMessages === 0}
      >
        <MessageIcon />
      </Badge>
    </IconButton>
  );
};
