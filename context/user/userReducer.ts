import { UserState } from ".";
import { User } from "../../interfaces";

type authType =
  | {
      type: "[User] - set user";
      payload: User;
    }
  | {
      type: "[User] - Remove user";
    };

export const authReducer = (state: UserState, action: authType): UserState => {
  switch (action.type) {
    case "[User] - set user":
      return {
        ...state,
        user: action.payload,
      };

    case "[User] - Remove user":
      return {
        ...state,
        user: undefined,
      };

    default:
      return state;
  }
};
