import { NextPage, GetStaticPropsContext } from "next";
import React, { useState, useCallback, useContext } from "react";
import { Container, Typography, Box, Tabs, Tab, Paper } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import { MainLayout } from "../../layouts";
import { useTranslations } from "next-intl";
import {
  SettingsProfile,
  SettingsAccount,
} from "../../components/organisms/settings";
import { UserContext } from "../../context/user";
import { useFeedback } from "../../hooks/useFeedback";
import { userService } from "../../services/user.service";

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
  const { user } = useContext(UserContext);
  const { showError, showSuccess } = useFeedback();

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  const handleProfileSave = useCallback((data: any) => {
    // TODO: Implement profile update logic
  }, []);

  const handlePasswordUpdate = useCallback(
    async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      if (!user?.id) {
        const errorMessage = t("passwordUpdateErrorMessage");
        showError({
          title: t("passwordUpdateError"),
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }

      const result = await userService.updatePassword(user.id, {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmationNewPassword: data.confirmPassword,
      });

      if (!result.ok) {
        const errorMessage =
          result.errorMessage || t("passwordUpdateErrorMessage");
        showError({
          title: t("passwordUpdateError"),
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }

      showSuccess({
        title: t("passwordUpdateSuccess"),
        message: t("passwordUpdateSuccessMessage"),
      });
    },
    [user, showError, showSuccess, t]
  );

  const handleDeleteAccount = useCallback(() => {
    // TODO: Implement account deletion logic
  }, []);

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
