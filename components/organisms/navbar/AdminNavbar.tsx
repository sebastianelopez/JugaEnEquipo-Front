import { AppBar, IconButton, Toolbar, Typography, Avatar, Box } from "@mui/material";
import { FC } from "react";
import { Menu } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { SelectCountry } from "../../molecules/SelectCountry/SelectCountry";

interface Props {
  handleDrawerToggle: () => void;
  DRAWER_WIDTH: number;
}

export const AdminNavbar: FC<Props> = ({
  handleDrawerToggle,
  DRAWER_WIDTH,
}) => {
  const t = useTranslations("Admin.navbar");

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        background: "rgba(44, 62, 80, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(108, 92, 231, 0.2)",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff" }}>
          {t("title")}
        </Typography>
        <Box sx={{ mr: 2 }}>
          <SelectCountry height={40} />
        </Box>
        <Avatar sx={{ bgcolor: "#6C5CE7" }}>A</Avatar>
      </Toolbar>
    </AppBar>
  );
};
