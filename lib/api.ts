import axiosInstance from "./axios";

export const api = {
  get: async <T>(url: string, params?: any, token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.get<T>(url, { params, headers });
    return response.data;
  },

  post: async <T>(
    url: string,
    data?: any,
    p0?: { headers: { "Content-Type": string } },
    token?: string
  ) => {
    const headers = {
      ...(p0?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await axiosInstance.post<T>(url, data, { headers });
    return response.data;
  },

  put: async <T>(url: string, data?: any, token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axiosInstance.put<T>(url, data, { headers });
    return response.data;
  },

  delete: async <T>(url: string, token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axiosInstance.delete<T>(url, { headers });
    return response.data;
  },
};
