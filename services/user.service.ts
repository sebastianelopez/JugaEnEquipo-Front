import { User } from "../interfaces";
import { api } from "../lib/api";
import { getToken } from "../services/auth.service";
import { v4 as uuidv4 } from "uuid";
import type { ServiceResult } from "./types";

interface UserResponse {
  data: User;
}

interface SearchUsersResponse {
  data: {
    data: User[];
    metadata: {
      quantity: number;
    };
  };
}

interface SearchFollowingUsersResponse {
  data: {
    data: User[];
    metadata: {
      quantity: number;
      hasMore: boolean;
    };
  };
}

interface SearchFollowingUsersParams {
  query: string;
  offset?: number;
  limit?: number;
}

interface CreateUserPayload {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmationPassword: string;
}

export const userService = {
  getUserById: async (id: string) => {
    const token = await getToken();
    const response = await api.get<UserResponse>(`/user/${id}`, {}, token);
    return response.data;
  },

  getUserByUsername: async (username: string, serverToken?: string) => {
    try {
      const token =
        typeof window === "undefined" ? serverToken : await getToken();

      const response = await api.get<UserResponse>(
        `/user/by-username/${username}`,
        {},
        token
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching user:", (error as Error).message);
      return null;
    }
  },

  createUser: async (
    userData: CreateUserPayload
  ): Promise<ServiceResult<User>> => {
    try {
      const payload = {
        id: uuidv4(),
        ...userData,
      };
      const response = await api.post<UserResponse>("/user", payload);
      return { ok: true, data: response.data };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";
      return { ok: false, errorMessage: message, error };
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    const token = await getToken();
    const response = await api.put<UserResponse>(
      `/user/${id}`,
      userData,
      token
    );
    return response.data;
  },

  deleteUser: async (id: string) => {
    const token = await getToken();
    return api.delete<void>(`/user/${id}`, token);
  },

  // Password management
  updatePassword: async (
    id: string,
    passwordData: {
      oldPassword: string;
      newPassword: string;
      confirmationNewPassword: string;
    }
  ) => {
    const token = await getToken();
    return api.put<void>(`/user/password/${id}`, passwordData, token);
  },

  restorePassword: async (
    id: string,
    passwordData: {
      newPassword: string;
      confirmationNewPassword: string;
    }
  ) => {
    const token = await getToken();
    return api.put<void>(`/user/${id}/restore`, passwordData, token);
  },

  // Profile image
  updateProfileImage: async (imageFile: File) => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("image", imageFile);
    return api.post<{ imageUrl: string }>(
      "/user-profile-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
      token
    );
  },

  // User relationships
  followUser: async (
    id: string
  ): Promise<ServiceResult<{ isFollowing: boolean }>> => {
    try {
      const token = await getToken();
      console.log("Following user:", id);
      console.log("Using token:", token);
      const response = await api.put<{
        isFollowing?: boolean;
        message?: string;
      }>(`/user/${id}/follow`, token);
      // Return success with isFollowing status (defaults to true if not provided)
      return {
        ok: true,
        data: { isFollowing: response?.isFollowing ?? true },
      };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to follow user";
      return { ok: false, errorMessage: message, error };
    }
  },

  unfollowUser: async (
    id: string
  ): Promise<ServiceResult<{ isFollowing: boolean }>> => {
    try {
      const token = await getToken();
      const response = await api.put<{
        isFollowing?: boolean;
        message?: string;
      }>(`/user/${id}/unfollow`, token);
      return {
        ok: true,
        data: { isFollowing: response?.isFollowing ?? false },
      };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to unfollow user";
      return { ok: false, errorMessage: message, error };
    }
  },

  getUserFollowings: async (id: string): Promise<User[]> => {
    try {
      const token = await getToken();
      const response = await api.get<User[] | { data: User[] }>(
        `/user/${id}/followings`,
        {},
        token
      );
      // Handle both array and wrapped response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response && typeof response === "object" && "data" in response) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching followings:", error);
      return [];
    }
  },

  getUserFollowers: async (id: string): Promise<User[]> => {
    try {
      const token = await getToken();
      const response = await api.get<User[] | { data: User[] }>(
        `/user/${id}/followers`,
        {},
        token
      );
      // Handle both array and wrapped response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response && typeof response === "object" && "data" in response) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching followers:", error);
      return [];
    }
  },

  searchUsers: async (query: string) => {
    const token = await getToken();
    return (
      await api.get<SearchUsersResponse>(
        `/users`,
        { q: `username:${encodeURIComponent(query)}` },
        token
      )
    ).data;
  },

  searchFollowingUsers: async ({
    query,
    offset = 0,
    limit = 20,
  }: SearchFollowingUsersParams): Promise<{
    users: User[];
    hasMore: boolean;
    nextOffset: number;
  }> => {
    const token = await getToken();
    try {
      const response = await api.get<SearchFollowingUsersResponse>(
        `/user/following/search`,
        {
          q: query,
          offset: offset.toString(),
          limit: limit.toString(),
        },
        token
      );

      const users = response.data.data || [];
      const hasMore = response.data.metadata?.hasMore || users.length === limit;

      return {
        users,
        hasMore,
        nextOffset: offset + users.length,
      };
    } catch (error) {
      console.error("Error searching following users:", error);
      return {
        users: [],
        hasMore: false,
        nextOffset: offset,
      };
    }
  },
};
