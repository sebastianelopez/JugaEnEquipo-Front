import { FC, PropsWithChildren, useReducer, useEffect } from "react";
import { UserContext, authReducer } from ".";

import { User } from "../../interfaces";
import Cookies from "js-cookie";
import { decodeUserIdByToken } from "../../utils/decodeIdByToken";
import { userService } from "../../services/user.service";

export interface UserState {
  user?: User;
}

const USER_INITIAL_STATE: UserState = {
  user: undefined,
};

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, USER_INITIAL_STATE);

  // Load user from token on mount
  useEffect(() => {
    const loadUserFromToken = async (retryCount = 0) => {
      try {
        // Skip loading user if we're in admin context
        // Check if we're on an admin route or if adminToken exists in localStorage
        if (typeof window !== "undefined") {
          const isAdminRoute = window.location.pathname.startsWith("/admin");
          const hasAdminToken = localStorage.getItem("adminToken");
          
          if (isAdminRoute || hasAdminToken) {
            return;
          }
        }

        const token = Cookies.get("token");
        if (token) {
          const userId = decodeUserIdByToken(token);
          const user = await userService.getUserById(userId);

          if (user) {
            setUser(user);
          }
        }
      } catch (error: any) {
        // Handle timeout errors gracefully - retry once, then silently fail
        const isTimeoutError =
          error?.code === "ECONNABORTED" || error?.message?.includes("timeout");

        if (isTimeoutError && retryCount < 1) {
          // Retry once after a short delay
          setTimeout(() => {
            loadUserFromToken(retryCount + 1);
          }, 2000);
          return;
        }

        // Only log non-timeout errors or timeout errors after retry
        // Skip 404 errors in admin context (they're expected)
        const is404Error = error?.response?.status === 404;
        if (!isTimeoutError && !is404Error) {
          console.error("Error loading user from token:", error);
        }
        // Silently handle timeout errors - app can function without initial user load
      }
    };

    loadUserFromToken();
  }, []);

  const setUser = (user: User) => {
    dispatch({ type: "[User] - set user", payload: user });
  };

  const removeUser = () => {
    dispatch({ type: "[User] - Remove user" });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,

        //Methods
        setUser,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
