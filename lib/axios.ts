import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import https from "https";
import { getAuthCookieOptions } from "../utils/cookies";

const isServer = typeof window === "undefined";

const baseURL = isServer
  ? process.env.NEXT_PUBLIC_API_URL || "https://api.jugaenequipo.com/api"
  : "/api/proxy";

const httpsAgent = isServer
  ? new https.Agent({
      rejectUnauthorized: process.env.NODE_ENV === "production",
    })
  : undefined;

const axiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  ...(httpsAgent && { httpsAgent }),
});

axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    const isLoginEndpoint = url.includes("/login") || url.endsWith("/login");
    
    if (!isLoginEndpoint) {
      const isAdminRequest = url.includes("/backoffice") || 
        (typeof window !== "undefined" && window.location.pathname.startsWith("/admin"));
      
      const token = isAdminRequest 
        ? Cookies.get("adminToken") 
        : Cookies.get("token");
      
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    const url = originalRequest?.url || "";
    const isLoginEndpoint = url.includes("/login") || url.endsWith("/login");
    const isRefreshTokenEndpoint = url.includes("refresh-token");
    
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
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    (originalRequest as any)._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = isAdminRequest 
        ? Cookies.get("adminRefreshToken")
        : Cookies.get("refreshToken");
      const token = isAdminRequest 
        ? Cookies.get("adminToken")
        : Cookies.get("token");
      
      if (!refreshToken) {
        const loginPage = isAdminRequest ? "/admin/login" : "/auth/login";
        const isOnLoginPage = typeof window !== "undefined" && 
          (window.location.pathname === loginPage || window.location.pathname.startsWith(loginPage));
        
        if (!isOnLoginPage) {
          if (isAdminRequest) {
            Cookies.remove("adminToken");
            Cookies.remove("adminRefreshToken");
          } else {
            Cookies.remove("token");
            Cookies.remove("refreshToken");
          }
          if (typeof window !== "undefined") {
            window.location.href = loginPage;
          }
        }
        throw new Error("No refresh token available");
      }

      const refreshEndpoint = isAdminRequest 
        ? `/backoffice/refresh-token`
        : `/refresh-token`;

      const response = await axiosInstance.post(
        refreshEndpoint,
        { refreshToken },
        {
          headers: {},
        }
      );

      const responseData = response.data?.data || response.data;
      const { token: newToken, refreshToken: newRefreshToken } = responseData;

      const cookieOptions = getAuthCookieOptions();
      if (isAdminRequest) {
        Cookies.set("adminToken", newToken, cookieOptions);
        Cookies.set("adminRefreshToken", newRefreshToken, cookieOptions);
      } else {
        Cookies.set("token", newToken, cookieOptions);
        Cookies.set("refreshToken", newRefreshToken, cookieOptions);
      }

      processQueue(null, newToken);

      if (originalRequest) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      if (isAdminRequest) {
        Cookies.remove("adminToken");
        Cookies.remove("adminRefreshToken");
      } else {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
      }
      
      const loginPage = isAdminRequest ? "/admin/login" : "/auth/login";
      
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
