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
    const loadUserFromToken = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const userId = decodeUserIdByToken(token);
          const user = await userService.getUserById(userId);
          console.log("User from token:", user);
          if (user) {
            setUser(user);
          }
        }
      } catch (error) {
        console.error("Error loading user from token:", error);
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
