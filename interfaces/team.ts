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
