import { useState, useCallback } from "react";
import { Tabs, Tab, Box, Paper } from "@mui/material";
import { useTranslations } from "next-intl";

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
      id={`tournament-tabpanel-${index}`}
      aria-labelledby={`tournament-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface TournamentTabsProps {
  // Information tab content
  informationContent: React.ReactNode;
  // Second tab content (Admin/Requests or Join card depending on permissions)
  secondTabContent: React.ReactNode;
  // Label for the second tab
  secondTabLabel: string;
}

export const TournamentTabs = ({
  informationContent,
  secondTabContent,
  secondTabLabel,
}: TournamentTabsProps) => {
  const t = useTranslations("Tournaments");
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  return (
    <Box
      sx={{
        display: { xs: "block", lg: "none" },
      }}
    >
      <Paper
        elevation={0}
        sx={{ borderRadius: 2, backgroundColor: "transparent" }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label={t("detail.tabs") || "Tournament tabs"}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab
            label={t("detail.information") || "Información"}
            id="tournament-tab-0"
          />
          <Tab label={secondTabLabel} id="tournament-tab-1" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {informationContent}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {secondTabContent}
        </TabPanel>
      </Paper>
    </Box>
  );
};
