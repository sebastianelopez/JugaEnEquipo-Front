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
  minGameRankId: string | null;
  maxGameRankId: string | null;
  responsibleId: string | null;
  name: string;
  description: string;
  rules: string | null;
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
  isUserRegistered: boolean;
}

export interface CreateTournamentPayload {
  gameId: string;
  responsibleId: string | null;
  creatorId?: string | null; // Optional, used for admin-created tournaments
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

export interface CreateBackofficeTournamentPayload {
  name: string;
  description: string;
  gameId: string;
  creatorId: string;
  responsibleId: string;
  rules: string | null;
  maxTeams: number;
  prize: string | null;
  region: string;
  startAt: string; // Format: "YYYY-MM-DD HH:mm:ss"
  endAt: string; // Format: "YYYY-MM-DD HH:mm:ss"
}