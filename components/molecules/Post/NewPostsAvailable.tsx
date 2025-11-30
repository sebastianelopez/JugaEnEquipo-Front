import { Box, Button, Typography } from "@mui/material";
import { RefreshRounded } from "@mui/icons-material";

interface NewPostsAvailableProps {
  newPostsCount: number;
  onLoadNewPosts: () => void;
  isLoading?: boolean;
}

export const NewPostsAvailable = ({
  newPostsCount,
  onLoadNewPosts,
  isLoading = false,
}: NewPostsAvailableProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 530,
        backgroundColor: "primary.main",
        borderRadius: 2,
        padding: 2,
        marginBottom: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: 1,
        animation: "slideDown 0.3s ease-out",
        "@keyframes slideDown": {
          from: {
            opacity: 0,
            transform: "translateY(-20px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <RefreshRounded sx={{ color: "white" }} />
        <Typography variant="body2" sx={{ color: "white" }}>
          {newPostsCount} {newPostsCount === 1 ? "nuevo post" : "nuevos posts"} disponible{newPostsCount === 1 ? "" : "s"}
        </Typography>
      </Box>
      
      <Button
        variant="contained"
        size="small"
        onClick={onLoadNewPosts}
        disabled={isLoading}
        sx={{
          backgroundColor: "white",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "grey.100",
          },
          minWidth: "auto",
          px: 2,
        }}
      >
        {isLoading ? "Cargando..." : "Ver nuevos"}
      </Button>
    </Box>
  );
};