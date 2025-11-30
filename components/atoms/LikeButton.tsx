import { Button, SxProps, Theme, useTheme } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useTranslations } from "next-intl";

interface Props {
  onClick: () => void;
  isPressed: boolean;
  sx?: SxProps<Theme>;
  isSmallScreen: boolean;
}

export const LikeButton = ({
  onClick,
  isPressed,
  sx,
  isSmallScreen,
}: Props) => {
  const publicationT = useTranslations("Publication");
  const theme = useTheme();

  return (
    <Button
      variant="text"
      onClick={onClick}
      startIcon={
        <FavoriteIcon
          sx={{
            color: isPressed ? "#E17055" : "inherit",
          }}
        />
      }
      sx={[
        ...(Array.isArray(sx) ? sx : [sx]),
        {
          color: isPressed ? "#E17055" : theme.palette.text.primary,
          "& .MuiButton-startIcon svg": {
            color: isPressed ? "#E17055" : "inherit",
          },
        },
      ]}
    >
      {!isSmallScreen && publicationT("likeButton")}
    </Button>
  );
};
