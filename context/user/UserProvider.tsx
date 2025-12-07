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

  useEffect(() => {
    const loadUserFromToken = async (retryCount = 0) => {
      try {
        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          const pathWithoutLocale = pathname.replace(/^\/(es|en|pt)/, "") || pathname;
          const isAdminRoute = pathWithoutLocale.startsWith("/admin");
          
          if (isAdminRoute) {
            return;
          }
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
          throw decodeError;
        }
      } catch (error: any) {
        const isTimeoutError =
          error?.code === "ECONNABORTED" || error?.message?.includes("timeout");

        if (isTimeoutError && retryCount < 1) {
          setTimeout(() => {
            loadUserFromToken(retryCount + 1);
          }, 2000);
          return;
        }

        const is404Error = error?.response?.status === 404;
        if (!isTimeoutError && !is404Error) {
          console.error("[UserProvider] Error loading user from token:", error);
        }
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
        setUser,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
