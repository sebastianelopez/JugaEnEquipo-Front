import { api } from "../lib/api";
import { ServiceResult } from "./types";
import { getToken } from "./auth.service";
import { v4 as uuidv4 } from "uuid";
import type { Team } from "../interfaces";
import type { Game } from "../interfaces";

interface CreateTeamPayload {
  name: string;
  description?: string;
  image?: string;
}

interface TeamRequest {
  id: string;
  teamId: string;
  userId: string;
  status?: string;
  createdAt?: string;
}

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

export const teamService = {
  /**
   * Create a new team
   * PUT /api/team/:id (with random UUID)
   */
  create: async (
    payload: CreateTeamPayload,
    teamId?: string
  ): Promise<ServiceResult<Team>> => {
    const token = await getToken();
    const id = teamId || uuidv4();
    return safeCall<Team>(() => api.put(`/team/${id}`, payload, token));
  },

  /**
   * Find a team by ID
   * GET /api/team/:id
   */
  find: async (id: string): Promise<ServiceResult<Team>> => {
    const token = await getToken();
    return safeCall<Team>(() => api.get(`/team/${id}`, {}, token));
  },

  /**
   * Delete a team
   * DELETE /api/team/:id
   */
  delete: async (id: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() => api.delete(`/team/${id}`, token));
  },

  /**
   * Search teams
   * GET /api/teams?mine=true
   * Without ?mine=true returns all teams, with ?mine=true returns only my teams
   */
  search: async (params?: {
    gameId?: string;
    mine?: boolean;
    tournamentId?: string;
    userId?: string;
    leaderId?: string;
    creatorId?: string;
  }): Promise<ServiceResult<Team[]>> => {
    const token = await getToken();
    const queryParams: any = {};
    
    if (params?.gameId) {
      queryParams.gameId = params.gameId;
    }
    if (params?.mine !== undefined) {
      queryParams.mine = params.mine.toString();
    }
    if (params?.tournamentId) {
      queryParams.tournamentId = params.tournamentId;
    }
    if (params?.userId) {
      queryParams.userId = params.userId;
    }
    if (params?.leaderId) {
      queryParams.leaderId = params.leaderId;
    }
    if (params?.creatorId) {
      queryParams.creatorId = params.creatorId;
    }
    
    return safeCall<Team[]>(() => api.get("/teams", queryParams, token));
  },

  /**
   * Get teams by user ID (where user is member, leader, or creator)
   * GET /api/teams?userId=:userId&leaderId=:userId&creatorId=:userId
   */
  getTeamsByUserId: async (userId: string): Promise<ServiceResult<Team[]>> => {
    const token = await getToken();
    const queryParams = {
      userId,
    };
    return safeCall<Team[]>(() => api.get("/teams", queryParams, token));
  },

  /**
   * Add a game to a team
   * PUT /api/team/:id/game/:game_id
   */
  addGame: async (
    teamId: string,
    gameId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put(`/team/${teamId}/game/${gameId}`, undefined, token)
    );
  },

  /**
   * Delete a game from a team
   * DELETE /api/team/:id/game/:game_id
   */
  deleteGame: async (
    teamId: string,
    gameId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.delete(`/team/${teamId}/game/${gameId}`, token)
    );
  },

  /**
   * Find all games for a team
   * GET /api/team/:id/games
   */
  findAllGames: async (teamId: string): Promise<ServiceResult<Game[]>> => {
    const token = await getToken();
    return safeCall<Game[]>(() => api.get(`/team/${teamId}/games`, {}, token));
  },

  /**
   * Update team leader
   * PUT /api/team/:id/leader/:user_id
   */
  updateLeader: async (
    teamId: string,
    userId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put(`/team/${teamId}/leader/${userId}`, undefined, token)
    );
  },

  /**
   * Request access to a team
   * PUT /api/team/:id/request-access
   */
  requestAccess: async (
    teamId: string,
    playerId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put(`/team/${teamId}/request-access`, { playerId }, token)
    );
  },

  /**
   * Accept a team access request
   * PUT /api/team/request/:request_id/accept
   */
  acceptAccess: async (requestId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put(`/team/request/${requestId}/accept`, undefined, token)
    );
  },

  /**
   * Find all team requests
   * GET /api/team/requests?teamId=:teamId
   */
  findAllRequests: async (
    teamId: string
  ): Promise<ServiceResult<TeamRequest[]>> => {
    const token = await getToken();
    try {
      const response = await api.get<{ requests: TeamRequest[] }>(
        "/team/requests",
        { teamId },
        token
      );

      const requests =
        (response as any)?.requests || (response as any)?.data?.requests || [];
      return { ok: true, data: requests };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Unknown error";
      return { ok: false, errorMessage: message, error };
    }
  },

  /**
   * POST /api/team/:id/leave
   */
  leaveTeam: async (teamId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();

    return safeCall<void>(() =>
      api.post(`/team/${teamId}/leave`, undefined, undefined, token)
    );
  },

  /**
   * Find all members of a team
   * GET /api/team/:team_id/members
   */
  findMembers: async (teamId: string): Promise<ServiceResult<any[]>> => {
    const token = await getToken();
    return safeCall<any[]>(() => api.get(`/team/${teamId}/members`, {}, token));
  },

  /**
   * Remove a member from a team (leader/creator only)
   * DELETE /api/team/:team_id/member/:user_id
   * Note: This might use the same leave endpoint, but from leader's perspective
   */
  removeMember: async (
    teamId: string,
    userId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    // Try DELETE first, if not available, might need to use leave endpoint
    return safeCall<void>(() =>
      api.delete(`/team/${teamId}/member/${userId}`, token)
    );
  },

  /**
   * Reject/Decline a team access request
   * PUT /api/team/request/:request_id/decline
   */
  rejectAccess: async (requestId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put(`/team/request/${requestId}/decline`, undefined, token)
    );
  },

  /**
   * Get team background image
   * GET /api/team/:team_id/background-image
   */
  getBackgroundImage: async (teamId: string): Promise<ServiceResult<string | null>> => {
    const token = await getToken();
    try {
      const response = await api.get<{ data: { backgroundImage: string } }>(
        `/team/${teamId}/background-image`,
        {},
        token
      );
      return { ok: true, data: response.data?.backgroundImage || null };
    } catch (error: any) {
      // If 404, return null (no background image)
      if (error?.response?.status === 404) {
        return { ok: true, data: null };
      }
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to get background image";
      return { ok: false, errorMessage: message, error };
    }
  },

  /**
   * Update team background image
   * PUT /api/team/:team_id/background-image
   */
  updateBackgroundImage: async (
    teamId: string,
    imageDataUri: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put(`/team/${teamId}/background-image`, { image: imageDataUri }, token)
    );
  },
};
