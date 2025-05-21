import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
// Determine if we're running on server or client
const isServer = typeof window === "undefined";

// Use absolute URL when on server, relative URL when on client in development
const baseURL = isServer
  ? process.env.NEXT_PUBLIC_API_URL || "https://api.jugaenequipo.com/api"
  : process.env.NODE_ENV === "development"
  ? "/api/proxy"
  : process.env.NEXT_PUBLIC_API_URL || "https://api.jugaenequipo.com/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variable to prevent multiple refresh token requests
let isRefreshing = false;
// Store pending requests
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];

// Process the queue of failed requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (token) {
      // Retry with new token
      request.config.headers.Authorization = `Bearer ${token}`;
      request.resolve(axios(request.config));
    }
  });

  failedQueue = [];
};

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // If the error is not 401 or the request was for refreshing token
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest?.url?.includes("refresh-token") ||
      (originalRequest as any)._retry
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    (originalRequest as any)._retry = true;
    isRefreshing = true;

    try {
      // Get the refresh token
      const refreshToken = Cookies.get("refreshToken");
      const token = Cookies.get("token");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Call the refresh token endpoint
      const response = await axios.post(
        `${baseURL}/refresh-token`,
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { token: newToken, refreshToken: newRefreshToken } =
        response.data.data;

      // Update cookies with new tokens
      Cookies.set("token", newToken, {
        secure: true,
        sameSite: "strict",
        expires: 7, // days
      });

      Cookies.set("refreshToken", newRefreshToken, {
        secure: true,
        sameSite: "strict",
        expires: 7, // days
      });

      // Process queued requests
      processQueue(null, newToken);

      // Retry the original request
      if (originalRequest) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      }
    } catch (refreshError) {
      // Handle refresh error - logout user
      processQueue(refreshError, null);
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
