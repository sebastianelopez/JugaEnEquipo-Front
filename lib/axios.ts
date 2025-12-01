import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import https from "https";
import { getAuthCookieOptions } from "../utils/cookies";

// Determine if we're running on server or client
const isServer = typeof window === "undefined";

// Use absolute URL when on server, relative URL when on client (both dev and prod)
// Using proxy in client-side avoids CORS issues
const baseURL = isServer
  ? process.env.NEXT_PUBLIC_API_URL || "https://api.jugaenequipo.com/api"
  : "/api/proxy";

// Create HTTPS agent for server-side requests
const httpsAgent = isServer
  ? new https.Agent({
      rejectUnauthorized: process.env.NODE_ENV === "production",
    })
  : undefined;

const axiosInstance = axios.create({
  baseURL,
  timeout: 20000, // Increased from 10000ms to 20000ms (20 seconds) for better reliability
  headers: {
    "Content-Type": "application/json",
  },
  ...(httpsAgent && { httpsAgent }), // Only add httpsAgent for server-side requests
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

    const url = originalRequest?.url || "";
    const isLoginEndpoint = url.includes("/login") || url.endsWith("/login");
    const isRefreshTokenEndpoint = url.includes("refresh-token");

    if (
      !error.response ||
      error.response.status !== 401 ||
      isRefreshTokenEndpoint ||
      isLoginEndpoint ||
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
        // Don't redirect if we're already on login page or if this is right after login
        const isOnLoginPage = typeof window !== "undefined" && 
          (window.location.pathname === "/auth/login" || window.location.pathname.startsWith("/auth/login"));
        
        if (!isOnLoginPage) {
          // Only redirect if not already on login page
          Cookies.remove("token");
          Cookies.remove("refreshToken");
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
        }
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

      // Update cookies with new tokens using mobile-compatible options
      const cookieOptions = getAuthCookieOptions();
      Cookies.set("token", newToken, cookieOptions);
      Cookies.set("refreshToken", newRefreshToken, cookieOptions);

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
      
      // Only redirect if not already on login page to avoid loops
      if (typeof window !== "undefined") {
        const isOnLoginPage = window.location.pathname === "/auth/login" || 
          window.location.pathname.startsWith("/auth/login");
        
        if (!isOnLoginPage) {
          window.location.href = "/auth/login";
        }
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
