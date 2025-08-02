import { User } from "../interfaces";
import { api } from "../lib/api";
import { getToken } from "../services/auth.service";

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

  createUser: async (userData: User) => {
    const token = await getToken();
    const response = await api.post<UserResponse>(
      "/user",
      userData,
      undefined,
      token
    );
    return response.data;
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
  followUser: async (id: string) => {
    const token = await getToken();
    return api.put<void>(`/user/${id}/follow`, {}, token);
  },

  unfollowUser: async (id: string) => {
    const token = await getToken();
    return api.put<void>(`/user/${id}/unfollow`, {}, token);
  },

  getUserFollowings: async (id: string) => {
    const token = await getToken();
    return api.get<User[]>(`/user/${id}/followings`, {}, token);
  },

  getUserFollowers: async (id: string) => {
    const token = await getToken();
    return api.get<User[]>(`/user/${id}/followers`, {}, token);
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
