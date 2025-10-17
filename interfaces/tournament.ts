import { Game } from "./game";
import { Team } from "./team";
import { User } from "./user";

export type TournamentType = "Oficial" | "Amateur";
export type ParticipationMode = "individual" | "team";

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  type: TournamentType;
  region: string;
  game: Game;
  participationMode: ParticipationMode;
  registeredTeams: number;
  maxTeams?: number;
  maxParticipants?: number;
  startDate?: string; // ISO
  endDate?: string; // ISO
  createdBy: User | string;
  rules?: string;
}

export interface CreateTournamentPayload {
  name: string;
  description?: string;
  type: TournamentType;
  region: string;
  gameId: string;
  participationMode: ParticipationMode;
  // one of the two depending on participationMode
  maxTeams?: number;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
  rules?: string;
}

export interface JoinTournamentPayload {
  tournamentId: string;
  // depending on participation mode we accept one of these
  teamId?: Team["id"];
  userId?: User["id"];
}
