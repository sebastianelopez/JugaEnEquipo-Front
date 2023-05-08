import { AuthState } from ".";
import { User } from "../../interfaces";

type authType =
  | {
      type: "[Auth] - Login";
      payload: User;
    }
    |{
      type: "[Auth] - Logout";      
    };  

export const authReducer = (state: AuthState, action: authType): AuthState => {
  switch (action.type) {
    case "[Auth] - Login":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload
      };
  
      case "[Auth] - Logout":
        return {
          ...state,
          isLoggedIn: false,
          user: undefined
        }

    default:
      return state;
  }
};
