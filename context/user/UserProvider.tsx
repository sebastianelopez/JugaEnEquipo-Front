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
        // Skip loading user if admin token exists (admin uses different cookie names)
        const adminToken = Cookies.get("adminToken");
        if (adminToken) {
          return;
        }

        const token = Cookies.get("token");
        if (!token) {
          return;
        }

        try {
          const userId = decodeUserIdByToken(token);
          const user = await userService.getUserById(userId);

          if (user) {
            setUser(user);
          }
        } catch (decodeError: any) {
          // Silently handle errors - user loading failures shouldn't break the app
          throw decodeError;
        }
      } catch (error: any) {
        // Handle timeout errors gracefully - retry once, then silently fail
        const isTimeoutError =
          error?.code === "ECONNABORTED" || error?.message?.includes("timeout");

        if (isTimeoutError && retryCount < 1) {
          console.log("[UserProvider] Timeout error, retrying...");
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
          console.error("[UserProvider] Error loading user from token:", error);
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
