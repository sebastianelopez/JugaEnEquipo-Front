import { useState, useCallback } from "react";
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { PostList } from "../../molecules/Post/PostList";
import { Post } from "../../../interfaces";
import { AboutCard } from "./AboutCard";
import { GamesGrid } from "./GamesGrid";
import { TeamsList } from "./TeamsList";
import { TournamentsGrid } from "./TournamentsGrid";
import { AchievementsList as ProfileAchievementsList } from "./AchievementsList";
import { SocialLinksCard } from "./SocialLinksCard";
import { QuickStatsCard } from "./QuickStatsCard";

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface ProfileTabsProps {
  // Posts props
  posts: Post[];
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
  // About props
  hasDescription: boolean;
  description?: string;
  stats: { label: string; value: string | number; color?: any }[];
  // Games props
  hasGames: boolean;
  games: Array<{
    name: string;
    icon?: string;
    rank?: string;
    accountInfo?: string;
    roles?: Array<{ roleName: string; roleDescription?: string }>;
    hoursPlayed?: number;
    gameRank?: { id: string; name: string; level: number };
    gameId?: string;
    isOwnershipVerified?: boolean;
  }>;
  // Teams props
  hasTeams: boolean;
  teams: {
    id: string | number;
    name: string;
    logo?: string;
    role?: string;
    position?: string;
    joinDate?: string | number | Date;
    leftDate?: string | number | Date;
  }[];
  // Tournaments props
  hasTournaments: boolean;
  tournaments: {
    id: string | number;
    name: string;
    game?: string;
    image?: string;
    date?: string | number | Date;
    placement?: string;
  }[];
  // Achievements props
  hasAchievements: boolean;
  achievements: {
    title: string;
    tournament?: string;
    game?: string;
    date?: string | number | Date;
    prize?: string;
  }[];
  // Social links props
  hasSocialLinks: boolean;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    twitch?: string;
  };
  // Quick stats props
  hasQuickStats: boolean;
  currentTeams: number;
  activeGames: number;
  totalAchievements: number;
}

export const ProfileTabs = ({
  posts,
  isLoading,
  hasError,
  onRetry,
  hasDescription,
  description,
  stats,
  hasGames,
  games,
  hasTeams,
  teams,
  hasTournaments,
  tournaments,
  hasAchievements,
  achievements,
  hasSocialLinks,
  socialLinks,
  hasQuickStats,
  currentTeams,
  activeGames,
  totalAchievements,
}: ProfileTabsProps) => {
  const t = useTranslations("Profile");
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
        display: { xs: "block", md: "none" },
      }}
    >
      <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: "transparent" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label={t("profile")}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab label={t("posts")} id="profile-tab-0" />
          <Tab label={t("information")} id="profile-tab-1" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PostList
              isLoading={isLoading}
              posts={posts}
              error={hasError}
              onRetry={onRetry}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {hasDescription && (
            <AboutCard description={description!} stats={stats} />
          )}

          {hasGames && (
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  {t("games")}
                </Typography>
                <GamesGrid games={games} />
              </CardContent>
            </Card>
          )}

          {hasTeams && (
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  {t("teams")}
                </Typography>
                <TeamsList teams={teams} />
              </CardContent>
            </Card>
          )}

          {hasTournaments && (
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  {t("recentTournaments")}
                </Typography>
                <TournamentsGrid tournaments={tournaments} />
              </CardContent>
            </Card>
          )}

          {hasAchievements && (
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  {t("achievements")}
                </Typography>
                <ProfileAchievementsList achievements={achievements} />
              </CardContent>
            </Card>
          )}

          {hasSocialLinks && <SocialLinksCard links={socialLinks} />}
          {hasQuickStats && (
            <QuickStatsCard
              currentTeams={currentTeams}
              activeGames={activeGames}
              totalAchievements={totalAchievements}
            />
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};
