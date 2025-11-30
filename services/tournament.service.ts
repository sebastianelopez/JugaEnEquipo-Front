import { api } from "../lib/api";
import { ServiceResult } from "./types";
import { getToken } from "./auth.service";
import type { Tournament, CreateTournamentPayload, Team } from "../interfaces";

async function safeCall<T>(fn: () => Promise<any>): Promise<ServiceResult<T>> {
  try {
    const data = await fn();
    const unwrapped =
      (data && (data.data || data.payload || data.result)) ?? data;
    return { ok: true, data: unwrapped as T };
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "Unknown error";
    return { ok: false, errorMessage: message, error };
  }
}

export const tournamentService = {
  /**
   * Create or update a tournament
   * POST /api/tournament/:tournamentId
   */
  create: async (
    tournamentId: string,
    payload: CreateTournamentPayload
  ): Promise<ServiceResult<Tournament>> => {
    const token = await getToken();
    return safeCall<Tournament>(() =>
      api.put(`/tournament/${tournamentId}`, payload, token)
    );
  },

  /**
   * Find a tournament by ID
   * GET /api/tournament/:id
   */
  find: async (id: string): Promise<ServiceResult<Tournament>> => {
    const token = await getToken();
    return safeCall<Tournament>(() => api.get(`/tournament/${id}`, {}, token));
  },

  /**
   * Delete a tournament
   * DELETE /api/tournament/:id
   */
  delete: async (id: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() => api.delete(`/tournament/${id}`, token));
  },

  /**
   * Search tournaments
   * GET /api/tournaments
   */
  search: async (params?: {
    total?: number;
    count?: number;
    limit?: number;
    offset?: number;
    name?: string;
    gameId?: string;
    statusId?: string;
    open?: boolean;
    mine?: boolean;
    [key: string]: any;
  }): Promise<ServiceResult<Tournament[]>> => {
    const token = await getToken();
    return safeCall<Tournament[]>(() => api.get("/tournaments", params, token));
  },

  /**
   * Add a team to a tournament
   * POST /api/tournament/:tournament_id/team/:team_id
   */
  addTeam: async (
    tournamentId: string,
    teamId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put(`/tournament/${tournamentId}/team/${teamId}`, token)
    );
  },

  /**
   * Remove a team from a tournament
   * DELETE /api/tournament/:tournament_id/team/:team_id
   */
  deleteTeam: async (
    tournamentId: string,
    teamId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.delete(`/tournament/${tournamentId}/team/${teamId}`, token)
    );
  },

  /**
   * Get tournament teams
   * GET /api/teams?tournamentId=:tournamentId
   */
  getTournamentTeams: async (
    tournamentId: string
  ): Promise<ServiceResult<Team[]>> => {
    const token = await getToken();
    return safeCall<Team[]>(() => api.get(`/teams`, { tournamentId }, token));
  },

  /**
   * Assign a responsible user to a tournament
   * POST /api/tournament/:tournament_id/responsible/:user_id
   */
  assignResponsible: async (
    tournamentId: string,
    userId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put(
        `/tournament/${tournamentId}/responsible/${userId}`,

        token
      )
    );
  },

  /**
   * Leave a tournament (team leaves)
   * POST /api/tournament/:tournament_id/team/:team_id/leave
   */
  leaveTournament: async (
    tournamentId: string,
    teamId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.post(
        `/tournament/${tournamentId}/team/${teamId}/leave`,
        {},
        undefined,
        token
      )
    );
  },

  /**
   * Search tournament status
   * GET /api/tournament-status
   */
  searchStatus: async (params?: {
    [key: string]: any;
  }): Promise<ServiceResult<any>> => {
    const token = await getToken();
    return safeCall<any>(() => api.get("/tournament-status", params, token));
  },
};
