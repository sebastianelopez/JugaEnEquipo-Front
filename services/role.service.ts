import { api } from "../lib/api";
import { ServiceResult } from "./types";
import { getToken } from "./auth.service";
import type { Role } from "../interfaces/role";

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

export const roleService = {
  /**
   * Find all roles by game ID
   * GET /api/game/:id/roles
   */
  findAllByGame: async (gameId: string): Promise<ServiceResult<Role[]>> => {
    const token = await getToken();
    return safeCall<Role[]>(() => api.get(`/game/${gameId}/roles`, {}, token));
  },
};
