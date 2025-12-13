import { Game } from "./game";

export interface Team {
  id: string;
  games: Game[];
  name: string;
  description: string;
  image: string;
  creatorId: string;
  leaderId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TeamGame {
  id: string;
  teamId: string;
  gameId: string;
  gameName: string;
  addedAt: string;
}