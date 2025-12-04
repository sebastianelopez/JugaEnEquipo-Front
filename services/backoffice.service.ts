import { api } from "../lib/api";
import { getToken } from "./auth.service";
import { ServiceResult } from "./types";

// Types
export interface Admin {
  id: string;
  name: string;
  user: string;
  role: "admin" | "superadmin";
  password?: string;
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface AdminSearchParams {
  name?: string;
  user?: string;
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
}

export interface SearchMetadata {
  total: number;
  count: number;
  limit: number;
  offset: number;
}

export interface AdminSearchResponse {
  data: Admin[];
  metadata: SearchMetadata;
}

export interface UserSearchParams {
  email?: string;
  username?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}

export interface UserSearchResponse {
  data: User[];
  metadata: SearchMetadata;
}

export interface User {
  id: string;
  firstname?: string;
  lastname?: string;
  username: string;
  email: string;
  description?: string | null;
  createdAt?: string;
  verifiedAt?: string | null;
  disabledAt?: string | null;
  isVerified?: boolean;
  isDisabled?: boolean;
  verified?: boolean; // Legacy field for backward compatibility
  disabled?: boolean; // Legacy field for backward compatibility
}

export interface PostSearchParams {
  email?: string;
  username?: string;
  postId?: string;
  userId?: string;
  q?: string;
  disabled?: boolean;
  limit?: number;
  offset?: number;
}

export interface PostSearchResponse {
  data: Post[];
  metadata: SearchMetadata;
}

export interface Post {
  id: string;
  body: string;
  userId: string;
  username: string;
  userEmail: string;
  sharedPostId: string | null;
  createdAt: string;
  disabled: boolean;
  moderationReason: string | null;
  disabledAt: string | null;
  likesCount: number;
  commentsCount: number;
}

export interface DisablePostPayload {
  reason:
    | "inappropriate_content"
    | "spam"
    | "harassment"
    | "hate_speech"
    | "violence"
    | "sexual_content"
    | "misinformation"
    | "copyright_violation";
}

export interface HashtagSearchParams {
  tag?: string;
}

export interface HashtagSearchResponse {
  data: Hashtag[];
  metadata: SearchMetadata;
}

export interface Hashtag {
  id: string;
  tag: string;
  count: number;
  createdAt: string;
  updatedAt: string;
  disabled: boolean;
  disabledAt: string | null;
}

export interface TeamSearchParams {
  name?: string;
  creatorUsername?: string;
  creatorEmail?: string;
  disabled?: boolean;
  limit?: number;
  offset?: number;
}

export interface TeamSearchResponse {
  data: Team[];
  metadata: SearchMetadata;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  image: string | null;
  creatorId: string;
  creatorUsername: string;
  creatorEmail: string;
  membersCount: number;
  gamesCount: number;
  disabled: boolean;
  moderationReason: string | null;
  disabledAt: string | null;
  createdAt: string;
}

export interface TournamentSearchParams {
  name?: string;
  responsibleUsername?: string;
  responsibleEmail?: string;
  disabled?: boolean;
  limit?: number;
  offset?: number;
}

export interface TournamentSearchResponse {
  data: Tournament[];
  total?: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  image: string | null;
  gameId: string;
  gameName: string;
  responsibleId: string;
  responsibleUsername: string;
  responsibleEmail: string;
  status: string;
  registeredTeams: number;
  maxTeams: number;
  isOfficial: boolean;
  prize: string | null;
  region: string;
  startAt: string;
  endAt: string;
  disabled: boolean;
  moderationReason: string | null;
  disabledAt: string | null;
  createdAt: string;
}

export interface DashboardStats {
  users?: number;
  posts?: number;
  teams?: number;
  tournaments?: number;
  [key: string]: any;
}

export interface DashboardStatsResponse {
  data: DashboardStats;
}

export interface BackofficeLoginData {
  id: string;
  token: string;
  refreshToken: string;
  role: "admin" | "superadmin";
}

export interface BackofficeLoginResponse {
  data: BackofficeLoginData;
}

async function safeCall<T>(fn: () => Promise<any>): Promise<ServiceResult<T>> {
  try {
    const data = await fn();

    // If the response has both 'data' and 'metadata', preserve both
    // Otherwise, unwrap 'data' if it exists
    if (data?.data !== undefined && data?.metadata !== undefined) {
      return {
        ok: true,
        data: { data: data.data, metadata: data.metadata } as T,
      };
    }
    const unwrapped = data?.data !== undefined ? data.data : data;
    return { ok: true, data: unwrapped as T };
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "Unknown error";
    return { ok: false, errorMessage: message, error };
  }
}

export const backofficeService = {
  // Auth
  login: async (
    user: string,
    password: string
  ): Promise<ServiceResult<BackofficeLoginData>> => {
    return safeCall<BackofficeLoginData>(() =>
      api.post<BackofficeLoginResponse>("/backoffice/login", {
        user,
        password,
      })
    );
  },

  // Admin endpoints
  searchAdmins: async (
    params?: AdminSearchParams
  ): Promise<ServiceResult<{ data: Admin[]; metadata: SearchMetadata }>> => {
    const token = await getToken();
    return safeCall<{ data: Admin[]; metadata: SearchMetadata }>(() =>
      api.get<AdminSearchResponse>("/backoffice/admins", params, token)
    );
  },

  createOrUpdateAdmin: async (
    adminId: string,
    data: {
      name: string;
      user: string;
      role: "admin" | "superadmin";
      password: string;
    }
  ): Promise<ServiceResult<Admin>> => {
    const token = await getToken();
    return safeCall<Admin>(() =>
      api.put<Admin>(`/backoffice/admin/${adminId}`, data, token)
    );
  },

  deleteAdmin: async (adminId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.delete<void>(`/backoffice/admin/${adminId}`, token)
    );
  },

  // User endpoints
  searchUsers: async (
    params?: UserSearchParams
  ): Promise<ServiceResult<{ data: User[]; metadata: SearchMetadata }>> => {
    const token = await getToken();
    return safeCall<{ data: User[]; metadata: SearchMetadata }>(() =>
      api.get<UserSearchResponse>("/backoffice/users", params, token)
    );
  },

  disableUser: async (userId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.post<void>(`/backoffice/user/${userId}/disable`, {}, undefined, token)
    );
  },

  enableUser: async (userId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.post<void>(`/backoffice/user/${userId}/enable`, {}, undefined, token)
    );
  },

  // Post endpoints
  searchPosts: async (
    params?: PostSearchParams
  ): Promise<ServiceResult<{ data: Post[]; metadata: SearchMetadata }>> => {
    const token = await getToken();
    return safeCall<{ data: Post[]; metadata: SearchMetadata }>(() =>
      api.get<PostSearchResponse>("/backoffice/posts", params, token)
    );
  },

  disablePost: async (
    postId: string,
    reason: DisablePostPayload["reason"]
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.post<void>(
        `/backoffice/post/${postId}/disable`,
        { reason },
        undefined,
        token
      )
    );
  },

  enablePost: async (postId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.post<void>(`/backoffice/post/${postId}/enable`, {}, undefined, token)
    );
  },

  // Hashtag endpoints
  searchHashtags: async (
    params?: HashtagSearchParams
  ): Promise<ServiceResult<{ data: Hashtag[]; metadata: SearchMetadata }>> => {
    const token = await getToken();
    return safeCall<{ data: Hashtag[]; metadata: SearchMetadata }>(() =>
      api.get<HashtagSearchResponse>("/backoffice/hashtags", params, token)
    );
  },

  disableHashtag: async (hashtagId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put<void>(`/backoffice/hashtag/${hashtagId}/disable`, {}, token)
    );
  },

  enableHashtag: async (hashtagId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.put<void>(`/backoffice/hashtag/${hashtagId}/enable`, {}, token)
    );
  },

  // Team endpoints
  searchTeams: async (
    params?: TeamSearchParams
  ): Promise<ServiceResult<{ data: Team[]; metadata: SearchMetadata }>> => {
    const token = await getToken();
    return safeCall<{ data: Team[]; metadata: SearchMetadata }>(() =>
      api.get<TeamSearchResponse>("/backoffice/teams", params, token)
    );
  },

  disableTeam: async (teamId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.post<void>(`/backoffice/team/${teamId}/disable`, {}, undefined, token)
    );
  },

  enableTeam: async (teamId: string): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.post<void>(`/backoffice/team/${teamId}/enable`, {}, undefined, token)
    );
  },

  // Tournament endpoints
  searchTournaments: async (
    params?: TournamentSearchParams
  ): Promise<
    ServiceResult<{ data: Tournament[]; metadata: SearchMetadata }>
  > => {
    const token = await getToken();
    return safeCall<{ data: Tournament[]; metadata: SearchMetadata }>(() =>
      api.get<TournamentSearchResponse>(
        "/backoffice/tournaments",
        params,
        token
      )
    );
  },

  createOfficialTournament: async (
    tournamentId: string,
    payload: {
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
  ): Promise<ServiceResult<Tournament>> => {
    const token = await getToken();
    return safeCall<Tournament>(() =>
      api.put<Tournament>(`/backoffice/tournament/${tournamentId}`, payload, token)
    );
  },

  disableTournament: async (
    tournamentId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.post<void>(
        `/backoffice/tournament/${tournamentId}/disable`,
        {},
        undefined,
        token
      )
    );
  },

  enableTournament: async (
    tournamentId: string
  ): Promise<ServiceResult<void>> => {
    const token = await getToken();
    return safeCall<void>(() =>
      api.post<void>(
        `/backoffice/tournament/${tournamentId}/enable`,
        {},
        undefined,
        token
      )
    );
  },

  // Dashboard endpoints
  getDashboardStats: async (): Promise<
    ServiceResult<DashboardStatsResponse>
  > => {
    const token = await getToken();
    return safeCall<DashboardStatsResponse>(() =>
      api.get<DashboardStatsResponse>("/backoffice/dashboard/stats", {}, token)
    );
  },
};
