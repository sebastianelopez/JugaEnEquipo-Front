import { api } from "../lib/api";
import { ServiceResult } from "./types";
import { getToken } from "./auth.service";
import { v4 as uuidv4 } from "uuid";
import { Player } from "../interfaces";

interface CreatePlayerPayload {
  gameId: string;
  gameRoleIds: string[];
  accountData: {
    // RIOT Games
    region?: string;
    username?: string;
    tag?: string;
    // STEAM
    steamId?: string;
  };
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

export const playerService = {
  /**
   * Create a new player
   * PUT /api/player/:id (with random UUID)
   */
  create: async (
    payload: CreatePlayerPayload,
    playerId?: string
  ): Promise<ServiceResult<Player>> => {
    const token = await getToken();
    const id = playerId || uuidv4();
    return safeCall<Player>(() => api.put(`/player/${id}`, payload, token));
  },

  /**
   * Find a player by ID
   * GET /api/player/:id
   */
  find: async (id: string): Promise<ServiceResult<Player>> => {
    const token = await getToken();
    return safeCall<Player>(() => api.get(`/player/${id}`, {}, token));
  },

  /**
   * Delete a player
   * DELETE /api/player/:id
   */
  delete: async (id: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() => api.delete(`/player/${id}`, token));
  },

  /**
   * Search players
   * GET /api/players
   */
  search: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    userId: string;
    [key: string]: any;
  }): Promise<ServiceResult<Player[]>> => {
    const token = await getToken();
    return safeCall<Player[]>(() => api.get("/players", params, token));
  },
};
