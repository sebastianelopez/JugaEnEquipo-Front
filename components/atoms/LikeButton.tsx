import { IconButton } from "@mui/material";
import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Props {}

export const LikeButton = ({}: Props) => {
  const [pressed, setPressed] = useState<boolean>(false);

  const handeClick = () => {
    setPressed(!pressed);
  };

  return (
    <IconButton aria-label="like" aria-pressed={pressed} onClick={handeClick}>
      <FavoriteIcon sx={{
        color: pressed ? 'red': 'inherit'
      }} />
    </IconButton>
  );
};
