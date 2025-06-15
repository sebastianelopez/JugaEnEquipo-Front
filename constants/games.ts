import { Game } from "../interfaces";

import lolLogo from "../assets/logos/lol.jpg";
import counterstrikeLogo from "../assets/logos/counterstrike.webp";
import heroesofthestormLogo from "../assets/logos/heroesofthestorm.jpg";
import overwatchLogo from "../assets/logos/overwatch.jpg";
import valorantLogo from "../assets/logos/valorant.png";

export const GAMES: Record<string, Game> = {
  LOL: {
    _id: "lol",
    name: "League of Legends",
    isVisible: true,
    image: lolLogo.src,
  },
  VALORANT: {
    _id: "valorant",
    name: "Valorant",
    isVisible: true,
    image: valorantLogo.src,
  },
  CSGO: {
    _id: "csgo",
    name: "CS:GO",
    isVisible: true,
    image: counterstrikeLogo.src,
  },
  HEROESOFTHESTORM: {
    _id: "heroesofthestorm",
    name: "Heroes of the Storm",
    isVisible: true,
    image: heroesofthestormLogo.src,
  },
  OVERWATCH: {
    _id: "overwatch2",
    name: "Overwatch 2",
    isVisible: true,
    image: overwatchLogo.src,
  },
};

export const GAMES_LIST = Object.values(GAMES);

export const getRandomGame = (): Game => {
  const gameKeys = Object.keys(GAMES);
  const randomIndex = Math.floor(Math.random() * gameKeys.length);
  return GAMES[gameKeys[randomIndex]];
};
