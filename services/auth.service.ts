import { api } from "../lib/api";
import Cookies from "js-cookie";
import axiosInstance from "../lib/axios";
import type { ServiceResult } from "./types";

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
  };
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<LoginResponse>("/login", {
      email,
      password,
    });

    const token = response.data.token;
    const refreshToken = response.data.refreshToken;

    Cookies.set("token", token, {
      secure: true,
      sameSite: "strict",
      expires: 7,
    });

    Cookies.set("refreshToken", refreshToken, {
      secure: true,
      sameSite: "strict",
      expires: 7,
    });

    return token;
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(apiError.response?.data?.message || "Login failed");
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
