import { api } from "../lib/api";
import { ServiceResult } from "./types";
import type {
  Tournament,
  CreateTournamentPayload,
  JoinTournamentPayload,
} from "../interfaces";

const basePath = "/tournaments";

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
  list: (params?: { page?: number; pageSize?: number; search?: string }) =>
    safeCall<Tournament[]>(() => api.get(basePath, params)),

  getById: (id: string) =>
    safeCall<Tournament>(() => api.get(`${basePath}/${id}`)),

  create: (payload: CreateTournamentPayload) =>
    safeCall<Tournament>(() => api.post(basePath, payload)),

  update: (id: string, payload: Partial<CreateTournamentPayload>) =>
    safeCall<Tournament>(() => api.put(`${basePath}/${id}`, payload)),

  remove: (id: string) => safeCall<void>(() => api.delete(`${basePath}/${id}`)),

  join: (payload: JoinTournamentPayload) =>
    safeCall<void>(() =>
      api.post(`${basePath}/${payload.tournamentId}/join`, payload)
    ),

  leave: (tournamentId: string) =>
    safeCall<void>(() => api.post(`${basePath}/${tournamentId}/leave`)),
};
