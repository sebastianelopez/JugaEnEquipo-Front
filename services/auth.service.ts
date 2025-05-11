import { api } from "../lib/api";
import Cookies from "js-cookie";
import axiosInstance from "../lib/axios";

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

    // Make sure we're extracting from the correct structure
    const token = response.data.token;
    const refreshToken = response.data.refreshToken;

    Cookies.set("token", token, {
      secure: true,
      sameSite: "strict",
      expires: 7, // days
    });

    Cookies.set("refreshToken", refreshToken, {
      secure: true,
      sameSite: "strict",
      expires: 7, // days
    });

    return token;
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(apiError.response?.data?.message || "Login failed");
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
