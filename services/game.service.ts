import { Game } from "../interfaces/game";
import { api } from "../lib/api";
import { getToken } from "./auth.service";
import type { ServiceResult } from "./types";

interface GamesResponse {
  data: Game[];
}

interface GameResponse {
  data: Game;
}

export const gameService = {
  getAllGames: async (): Promise<ServiceResult<Game[]>> => {
    try {
      const token = await getToken();
      const response = await api.get<GamesResponse>(`/games`, {}, token);
      return { ok: true, data: response.data || [] };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch games";
      return { ok: false, errorMessage: message, error };
    }
  },

  getGameById: async (id: string): Promise<ServiceResult<Game>> => {
    try {
      const token = await getToken();
      const response = await api.get<GameResponse>(`/game/${id}`, {}, token);
      return { ok: true, data: response.data };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch game";
      return { ok: false, errorMessage: message, error };
    }
  },

  /**
   * Get game requirements (what account data fields are required)
   * GET /api/game/:game_id/requirements
   */
  getGameRequirements: async (
    gameId: string
  ): Promise<ServiceResult<{ region?: boolean; username?: boolean; tag?: boolean; steamId?: boolean }>> => {
    try {
      const token = await getToken();
      const response = await api.get<{ data: { region?: boolean; username?: boolean; tag?: boolean; steamId?: boolean } }>(
        `/game/${gameId}/requirements`,
        {},
        token
      );
      return { ok: true, data: response.data };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch game requirements";
      return { ok: false, errorMessage: message, error };
    }
  },
};
