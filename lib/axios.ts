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
    // Don't add token for login endpoints (both regular and admin login)
    const url = config.url || "";
    const isLoginEndpoint = url.includes("/login") || url.endsWith("/login");
    
    if (!isLoginEndpoint) {
      const token = Cookies.get("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      request.resolve(axiosInstance(request.config));
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
    
    // Detect if this is an admin/backoffice request
    const isAdminRequest = url.includes("/backoffice") || 
      (typeof window !== "undefined" && window.location.pathname.startsWith("/admin"));

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
        // Determine the correct login page based on request type
        const loginPage = isAdminRequest ? "/admin/login" : "/auth/login";
        const isOnLoginPage = typeof window !== "undefined" && 
          (window.location.pathname === loginPage || window.location.pathname.startsWith(loginPage));
        
        if (!isOnLoginPage) {
          // Only redirect if not already on login page
          Cookies.remove("token");
          Cookies.remove("refreshToken");
          if (typeof window !== "undefined") {
            window.location.href = loginPage;
          }
        }
        throw new Error("No refresh token available");
      }

      // Use the same refresh token endpoint for both regular users and admin
      const refreshEndpoint = `/refresh-token`;

      // Call the refresh token endpoint using axiosInstance to go through proxy
      // Don't send Authorization header for refresh token endpoint (it uses refreshToken in body)
      const response = await axiosInstance.post(
        refreshEndpoint,
        { refreshToken },
        {
          headers: {
            // Refresh token endpoint typically doesn't need Authorization header
          },
        }
      );

      // Handle both response structures: response.data.data or response.data
      const responseData = response.data?.data || response.data;
      const { token: newToken, refreshToken: newRefreshToken } = responseData;

      // Update cookies with new tokens using mobile-compatible options
      const cookieOptions = getAuthCookieOptions();
      Cookies.set("token", newToken, cookieOptions);
      Cookies.set("refreshToken", newRefreshToken, cookieOptions);

      // Process queued requests
      processQueue(null, newToken);

      // Retry the original request
      if (originalRequest) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    } catch (refreshError) {
      // Handle refresh error - logout user
      processQueue(refreshError, null);
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      
      // Determine the correct login page based on request type
      const loginPage = isAdminRequest ? "/admin/login" : "/auth/login";
      
      // Only redirect if not already on login page to avoid loops
      if (typeof window !== "undefined") {
        const isOnLoginPage = window.location.pathname === loginPage || 
          window.location.pathname.startsWith(loginPage);
        
        if (!isOnLoginPage) {
          window.location.href = loginPage;
        }
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
