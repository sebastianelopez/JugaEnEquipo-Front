import { api } from "../lib/api";
import Cookies from "js-cookie";
import axiosInstance from "../lib/axios";
import type { ServiceResult } from "./types";
import { getAuthCookieOptions } from "../utils/cookies";

interface LoginResponse {
  data: {
    token: string;
    refreshToken: string;
  };
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<LoginResponse>("/login", {
      email,
      password,
    });

    const token = response.data.token;
    const refreshToken = response.data.refreshToken;

    if (!token || !refreshToken) {
      throw new Error("Invalid response: missing tokens");
    }

    const cookieOptions = getAuthCookieOptions();

    Cookies.set("token", token, cookieOptions);
    Cookies.set("refreshToken", refreshToken, cookieOptions);

    return token;
  } catch (error) {
    Cookies.remove("token");
    Cookies.remove("refreshToken");

    const apiError = error as ApiError;
    const errorMessage =
      apiError.response?.data?.message || apiError.message || "Login failed";
    throw new Error(errorMessage);
  }
};

export const loginSafe = async (
  email: string,
  password: string
): Promise<ServiceResult<string>> => {
  try {
    const token = await login(email, password);
    return { ok: true, data: token };
  } catch (error: any) {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    const message = error?.message || "Login failed";
    return { ok: false, errorMessage: message, error };
  }
};

export const logout = () => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
};

export const getToken = () => {
  return Cookies.get("token");
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get("token") && !!Cookies.get("refreshToken");
};

export const forgotPassword = async (
  email: string
): Promise<ServiceResult<void>> => {
  try {
    await api.post<void>("/auth/forgot-password", {
      email,
    });
    return { ok: true, data: undefined };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to send reset email";
    return { ok: false, errorMessage: message, error };
  }
};

export const resetPassword = async (
  token: string,
  password: string,
  passwordConfirmation: string
): Promise<ServiceResult<void>> => {
  try {
    await api.post<void>("/auth/reset-password", {
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
    return { ok: true, data: undefined };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to reset password";
    return { ok: false, errorMessage: message, error };
  }
};
