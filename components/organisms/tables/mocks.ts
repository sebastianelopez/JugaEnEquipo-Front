import { Game } from "../../../interfaces";
import { GAMES_LIST, getRandomGame } from "../../../constants/games";

// TournamentTable.mock.ts

// Assuming Game interface has these properties
export const mockGames: Game[] = [
  {
    _id: "1",
    name: "League of Legends",
    isVisible: true,
    image: "lol.png",
  },
  {
    _id: "2", 
    name: "Valorant",
    isVisible: true,
    image: "valorant.png",
  },
  {
    _id: "3",
    name: "Counter-Strike 2",
    isVisible: true,
    image: "cs2.png",
  },
  {
    _id: "4",
    name: "Dota 2",
    isVisible: true,
    image: "dota2.png",
  },
  {
    _id: "5",
    name: "Overwatch 2",
    isVisible: true,
    image: "overwatch2.png",
  },
];

export const mockTournaments = [
  {
    type: "Oficial" as const,
    name: "Summer Championship 2023",
    registeredTeams: 24,
    maxTeams: 32,
    game: getRandomGame(),
    region: "Europe",
  },
  {
    type: "Amateur" as const,
    name: "Winter Cup 2023",
    registeredTeams: 16,
    maxTeams: 24,
    game: getRandomGame(),
    region: "North America",
  },
  {
    type: "Oficial" as const,
    name: "Pro League Season 5",
    registeredTeams: 12,
    maxTeams: 16,
    game: getRandomGame(),
    region: "Global",
  },
  {
    type: "Amateur" as const,
    name: "Community Tournament",
    registeredTeams: 8,
    maxTeams: 16,
    game: getRandomGame(),
    region: "South America",
  },
  {
    type: "Oficial" as const,
    name: "Championship Series 2023",
    registeredTeams: 10,
    maxTeams: 12,
    game: getRandomGame(),
    region: "Asia",
  },
  {
    type: "Amateur" as const,
    name: "Rookie Cup 2023",
    registeredTeams: 6,
    maxTeams: 8,
    game: getRandomGame(),
    region: "Oceania",
  },
  {
    type: "Oficial" as const,
    name: "Masters Tournament",
    registeredTeams: 18,
    maxTeams: 24,
    game: getRandomGame(),
    region: "Europe",
  },
  {
    type: "Amateur" as const,
    name: "Rising Stars Challenge",
    registeredTeams: 14,
    maxTeams: 16,
    game: getRandomGame(),
    region: "North America",
  },
  {
    type: "Oficial" as const,
    name: "World Championship Qualifier",
    registeredTeams: 32,
    maxTeams: 32,
    game: getRandomGame(),
    region: "Global",
  },
  {
    type: "Amateur" as const,
    name: "Local Tournament Series",
    registeredTeams: 8,
    maxTeams: 12,
    game: getRandomGame(),
    region: "South America",
  },
  {
    type: "Oficial" as const,
    name: "Premier League",
    registeredTeams: 20,
    maxTeams: 20,
    game: getRandomGame(),
    region: "Europe",
  },
  {
    type: "Amateur" as const,
    name: "Regional Cup",
    registeredTeams: 12,
    maxTeams: 16,
    game: getRandomGame(),
    region: "Asia",
  },
];

// Generate more tournaments for testing pagination
const getGameForIndex = (index: number): Game => {
  return GAMES_LIST[index % GAMES_LIST.length];
};

const regions = ["NA", "EU", "LATAM", "ASIA", "OCE"];
const getRegionForIndex = (index: number): string => {
  return regions[index % regions.length];
};

export const generateManyTournaments = (count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    type: index % 3 === 0 ? "Oficial" : "Amateur",
    name: `Tournament ${index + 1}`,
    registeredTeams: ((index % 16) + 1),
    maxTeams: 16,
    game: getGameForIndex(index),
    region: getRegionForIndex(index),
  }));
};