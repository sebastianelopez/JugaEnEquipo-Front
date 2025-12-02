import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  People,
  AdminPanelSettings,
  Article,
  Tag,
  Groups,
  EmojiEvents,
  Logout,
  Dashboard,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FC, PropsWithChildren } from "react";
import Head from "next/head";
import { AdminNavbar } from "../components/organisms/navbar/AdminNavbar";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

const DRAWER_WIDTH = 260;

interface Props extends PropsWithChildren {
  title: string;
}

export const AdminLayout: FC<Props> = ({ children, title }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("Admin.menu");
  const tNavbar = useTranslations("Admin.navbar");

  const menuItems = [
    { title: t("dashboard"), icon: <Dashboard />, path: "/admin/dashboard" },
    { title: t("users"), icon: <People />, path: "/admin/users" },
    {
      title: t("admins"),
      icon: <AdminPanelSettings />,
      path: "/admin/admins",
    },
    { title: t("posts"), icon: <Article />, path: "/admin/posts" },
    { title: t("hashtags"), icon: <Tag />, path: "/admin/hashtags" },
    { title: t("teams"), icon: <Groups />, path: "/admin/teams" },
    {
      title: t("tournaments"),
      icon: <EmojiEvents />,
      path: "/admin/tournaments",
    },
  ];

  /*   // Verificar autenticación
  useEffect(() => {
    if (pathname !== "/admin/login") {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
      }
    }
  }, [pathname, router]); */

  const handleLogout = () => {
    // Remove admin token from localStorage
    localStorage.removeItem("adminToken");
    // Remove auth cookies
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    // Redirect to admin login
    router.push("/admin/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // No mostrar layout en página de login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background: "#2D3436",
        borderRight: "1px solid rgba(108, 92, 231, 0.2)",
      }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid rgba(108, 92, 231, 0.2)" }}>
        <Typography
          variant="h6"
          sx={{
            color: "#6C5CE7",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AdminPanelSettings />
          {tNavbar("title")}
        </Typography>
      </Box>

      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => router.push(item.path)}
              selected={pathname === item.path}
              sx={{
                borderRadius: 2,
                color:
                  pathname === item.path ? "#fff" : "rgba(255, 255, 255, 0.7)",
                background:
                  pathname === item.path
                    ? "rgba(108, 92, 231, 0.2)"
                    : "transparent",
                "&:hover": {
                  background: "rgba(108, 92, 231, 0.1)",
                  color: "#fff",
                },
                "&.Mui-selected": {
                  background: "rgba(108, 92, 231, 0.2)",
                  borderLeft: "3px solid #6C5CE7",
                  "&:hover": {
                    background: "rgba(108, 92, 231, 0.3)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ position: "absolute", bottom: 0, width: "100%", p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#E17055",
            "&:hover": {
              background: "rgba(225, 112, 85, 0.1)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary={tNavbar("logout")} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box sx={{ display: "flex", minHeight: "100vh", background: "#1A1A2E" }}>
        <AdminNavbar
          handleDrawerToggle={handleDrawerToggle}
          DRAWER_WIDTH={DRAWER_WIDTH}
        />
        <Box
          component="nav"
          sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </>
  );
};
