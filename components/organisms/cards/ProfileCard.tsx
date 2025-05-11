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
import { FC } from "react";
import { User } from "../../../interfaces";

interface Props {
  user: User;
}

export const ProfileCard: FC<Props> = ({ user }) => {
  const t = useTranslations("Profile");
  return (
    <Paper
      sx={{
        pb: 2,
        textAlign: "center",
        maxWidth: 400,
        position: "relative",
      }}
    >
      <Avatar
        alt="Profile Picture"
        src={user.profileImage}
        sx={{ width: "100%", height: 400, m: "auto" }}
        variant="square"
      />
      <Button
        children="Agregar jugador"
        sx={{
          position: "absolute",
          top: 350,
          left: 25,
        }}
      />
      <Typography variant="h4" fontWeight="bold">
        {user.nickname}
      </Typography>
      <Typography variant="subtitle1">{`${user.name} ${user.lastname}`}</Typography>
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
              primary="Contactos"
              primaryTypographyProps={{
                fontWeight: "bold",
                color: "gray",
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
              primaryTypographyProps={{
                fontWeight: "bold",
                color: "gray",
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
