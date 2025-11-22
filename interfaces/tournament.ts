import { Game } from "./game";
import { Team } from "./team";
import { User } from "./user";

export type TournamentType = "Oficial" | "Amateur";
export type ParticipationMode = "individual" | "team";

export interface Tournament {
  id: string;
  gameId: string;
  gameName: string;
  tournamentStatusId: string;
  responsibleId: string | null;
  name: string;
  description: string;
  registeredTeams: number;
  maxTeams: number;
  isOfficial: boolean;
  image: string | null;
  prize: string | null;
  region: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null; // (soft delete)
  minGameRankId: string | null;
  maxGameRankId: string | null;
}

export interface CreateTournamentPayload {
  gameId: string;
  responsibleId: string | null;
  name: string;
  description: string;
  maxTeams: number;
  isOfficial: boolean;
  image: string | null;
  prize: string | null;
  region: string;
  startAt: string; // ISO date string
  endAt: string; // ISO date string
  minGameRankId: string | null;
  maxGameRankId: string | null;
}

export interface JoinTournamentPayload {
  tournamentId: string;
  // depending on participation mode we accept one of these
  teamId?: Team["id"];
  userId?: User["id"];
}
