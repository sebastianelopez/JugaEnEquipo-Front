import { NextPage } from "next";
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Divider,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
  Grid,
  IconButton,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import { MainLayout } from "../../layouts";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SettingsPage: NextPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("es");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <MainLayout title="Configuración" pageDescription="Ajustes de usuario">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Configuración
        </Typography>

        <Paper elevation={3} sx={{ mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="configuración"
              variant="fullWidth"
            >
              <Tab icon={<PersonIcon />} label="Perfil" />
              <Tab icon={<SecurityIcon />} label="Cuenta" />
              <Tab icon={<NotificationsIcon />} label="Notificaciones" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Información del Perfil
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{ width: 100, height: 100, mb: 2 }}
                  alt="Foto de perfil"
                  src="/profile-placeholder.jpg"
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  size="small"
                >
                  Cambiar foto
                  <input hidden accept="image/*" type="file" />
                </Button>
              </Grid>

              <Grid item xs={12} sm={8}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    defaultValue="Usuario"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Apellidos"
                    defaultValue="De Ejemplo"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    defaultValue="usuario@ejemplo.com"
                    variant="outlined"
                    type="email"
                  />
                  <TextField
                    fullWidth
                    label="Biografía"
                    defaultValue=""
                    variant="outlined"
                    multiline
                    rows={4}
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Guardar cambios
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Configuración de la Cuenta
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Contraseña actual"
                type="password"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Nueva contraseña"
                type="password"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Confirmar contraseña"
                type="password"
                variant="outlined"
              />

              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="error" sx={{ mr: 2 }}>
                  Eliminar cuenta
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                >
                  Actualizar contraseña
                </Button>
              </Box>
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Preferencias de Notificación
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                }
                label="Activar notificaciones"
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Notificaciones por correo electrónico"
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Notificaciones push"
              />

              <FormControlLabel
                control={<Switch />}
                label="Notificaciones de marketing"
              />
            </Stack>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Guardar preferencias
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default SettingsPage;
