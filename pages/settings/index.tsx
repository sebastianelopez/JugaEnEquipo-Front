import { NextPage, GetStaticPropsContext } from "next";
import React, { useState, useCallback } from "react";
import { Container, Typography, Box, Tabs, Tab, Paper } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import { MainLayout } from "../../layouts";
import { useTranslations } from "next-intl";
import {
  SettingsProfile,
  SettingsAccount,
  SettingsNotifications,
} from "../../components/organisms/settings";
import type { NotificationPreferences } from "../../components/organisms/settings/SettingsNotifications";

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
  const t = useTranslations("Settings");

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  const handleProfileSave = useCallback((data: any) => {
    console.log("Profile data:", data);
    // TODO: Implement profile update logic
  }, []);

  const handlePasswordUpdate = useCallback((data: any) => {
    console.log("Password data:", data);
    // TODO: Implement password update logic
  }, []);

  const handleDeleteAccount = useCallback(() => {
    console.log("Delete account");
    // TODO: Implement account deletion logic
  }, []);

  const handleNotificationsSave = useCallback(
    (preferences: NotificationPreferences) => {
      console.log("Notification preferences:", preferences);
      // TODO: Implement notification preferences save logic
    },
    []
  );

  return (
    <MainLayout title={t("title")} pageDescription={t("pageDescription")}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("title")}
        </Typography>

        <Paper elevation={3} sx={{ mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label={t("title")}
              variant="fullWidth"
            >
              <Tab icon={<PersonIcon />} label={t("profileTab")} />
              <Tab icon={<SecurityIcon />} label={t("accountTab")} />
              <Tab icon={<NotificationsIcon />} label={t("notificationsTab")} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <SettingsProfile onSave={handleProfileSave} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SettingsAccount
              onUpdatePassword={handlePasswordUpdate}
              onDeleteAccount={handleDeleteAccount}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <SettingsNotifications onSave={handleNotificationsSave} />
          </TabPanel>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default SettingsPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
}
