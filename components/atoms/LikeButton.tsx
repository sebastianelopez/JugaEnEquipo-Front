import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Props {
  onClick: () => void;
  isPressed: boolean;
}

export const LikeButton = ({ onClick, isPressed }: Props) => {
  return (
    <IconButton aria-label="like" aria-pressed={isPressed} onClick={onClick}>
      <FavoriteIcon
        sx={{
          color: isPressed ? "red" : "inherit",
        }}
      />
    </IconButton>
  );
};
