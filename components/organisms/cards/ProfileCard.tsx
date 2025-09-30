import { LocationOn } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { FC, useContext } from "react";
import { User } from "../../../interfaces";
import { UserContext } from "../../../context/user";
import { useRouter } from "next/router";
import { chatService } from "../../../services/chat.service";

interface Props {
  user: User;
}

export const ProfileCard: FC<Props> = ({ user }) => {
  const t = useTranslations("Profile");

  const { user: loggedUser } = useContext(UserContext);

  const isLoggedUser = loggedUser?.username === user.username;
  const router = useRouter();

  const handleSendMessage = async () => {
    if (isLoggedUser) return;

    // Redirige a /messages con query para buscar la conversación
    router.push({
      pathname: "/messages",
      query: { userId: user.id },
    });
  };

  return (
    <Paper
      sx={{
        pb: 2,
        textAlign: "center",
        width: "100%",
        maxWidth: { xs: 530, md: 400 },
        position: "relative",
        borderRadius: "20px 20px 0px 0px",
      }}
    >
      <Avatar
        alt="Profile Picture"
        src={user.profileImage}
        sx={{
          width: "100%",
          height: 400,
          m: "auto",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
        variant="square"
      />
      <Button
        sx={{
          position: "absolute",
          top: 350,
          left: 25,
          height: 40,
        }}
        variant="contained"
        color="primary"
      >
        {isLoggedUser ? t("editProfilePicture") : t("followUser")}
      </Button>

      {!isLoggedUser ? (
        <Button
          sx={{
            position: "absolute",
            top: 350,
            left: 105,
          }}
          onClick={handleSendMessage}
        >
          {!isLoggedUser ? t("sendMessage") : null}
        </Button>
      ) : null}

      <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
        {user.username}
      </Typography>
      <Typography variant="subtitle1">{`${user.firstname} ${user.lastname}`}</Typography>
      <Box component={"div"} sx={{ p: 2 }}>
        <List sx={{ width: "100%", maxWidth: 360 }}>
          <ListItem>
            <ListItemIcon>
              <LocationOn />
            </ListItemIcon>
            <ListItemText primary="New York, NY" />
          </ListItem>
        </List>
      </Box>
      <Box component={"div"} sx={{ p: 2 }}>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            position: "relative",
          }}
        >
          <ListItem>
            <ListItemText
              primary="Seguidores"
              slotProps={{
                primary: {
                  typographyProps: { fontWeight: "bold", color: "gray" },
                },
              }}
            />
            <ListItemAvatar
              children={
                <Avatar
                  alt="Profile Picture"
                  src={
                    "https://thumbs.dreamstime.com/b/jugador-profesional-jugando-torneos-en-l%C3%ADnea-videojuegos-ordenador-con-auriculares-rojo-y-azul-195050715.jpg"
                  }
                />
              }
              sx={{
                position: "absolute",
                right: 0,
                cursor: "pointer",
              }}
            />
            <ListItemAvatar
              children={
                <Avatar
                  alt="Profile Picture"
                  src={
                    "https://estaticos-cdn.epe.es/clip/71532b63-7814-4884-887e-e7075eab4198_alta-libre-aspect-ratio_default_0.jpg"
                  }
                />
              }
              sx={{
                position: "absolute",
                right: 20,
                cursor: "pointer",
              }}
            />
            <ListItemAvatar
              children={
                <Avatar
                  alt="Profile Picture"
                  src={
                    "https://thumbs.dreamstime.com/b/captura-de-retrato-un-jugador-profesional-videojuegos-enfocado-en-joven-negro-foto-alta-calidad-200195882.jpg"
                  }
                />
              }
              sx={{
                position: "absolute",
                right: 40,
                cursor: "pointer",
              }}
            />
            <ListItemText
              secondary="230"
              secondaryTypographyProps={{ fontWeight: "bold" }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Seguidos"
              slotProps={{
                primary: {
                  typographyProps: { fontWeight: "bold", color: "gray" },
                },
              }}
            />
            <ListItemAvatar
              children={
                <Avatar
                  alt="Profile Picture"
                  src={
                    "https://thumbs.dreamstime.com/b/jugador-profesional-jugando-torneos-en-l%C3%ADnea-videojuegos-ordenador-con-auriculares-rojo-y-azul-195050715.jpg"
                  }
                />
              }
              sx={{
                position: "absolute",
                right: 0,
                cursor: "pointer",
              }}
            />
            <ListItemAvatar
              children={
                <Avatar
                  alt="Profile Picture"
                  src={
                    "https://estaticos-cdn.epe.es/clip/71532b63-7814-4884-887e-e7075eab4198_alta-libre-aspect-ratio_default_0.jpg"
                  }
                />
              }
              sx={{
                position: "absolute",
                right: 20,
                cursor: "pointer",
              }}
            />
            <ListItemAvatar
              children={
                <Avatar
                  alt="Profile Picture"
                  src={
                    "https://thumbs.dreamstime.com/b/captura-de-retrato-un-jugador-profesional-videojuegos-enfocado-en-joven-negro-foto-alta-calidad-200195882.jpg"
                  }
                />
              }
              sx={{
                position: "absolute",
                right: 40,
                cursor: "pointer",
              }}
            />
            <ListItemText
              secondary="230"
              secondaryTypographyProps={{ fontWeight: "bold" }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Teams"
              slotProps={{
                primary: {
                  typographyProps: { fontWeight: "bold", color: "gray" },
                },
              }}
            />
            <ListItemAvatar
              children={
                <Avatar
                  alt="Profile Picture"
                  src={
                    "https://yt3.googleusercontent.com/ytc/AGIKgqPrCccU4RCZE_0QD5_BD-MlEAGd40uZpDKNwhn2=s900-c-k-c0x00ffffff-no-rj"
                  }
                />
              }
              sx={{
                position: "absolute",
                right: 0,
                cursor: "pointer",
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};
