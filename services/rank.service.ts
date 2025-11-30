import { api } from "../lib/api";
import { ServiceResult } from "./types";
import { getToken } from "./auth.service";
import type { Rank } from "../interfaces/rank";

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

export const rankService = {
  /**
   * Find all ranks by game ID
   * GET /api/game/:id/ranks
   */
  findAllByGame: async (gameId: string): Promise<ServiceResult<Rank[]>> => {
    const token = await getToken();
    return safeCall<Rank[]>(() => api.get(`/game/${gameId}/ranks`, {}, token));
  },
};
