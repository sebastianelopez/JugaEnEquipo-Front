import { createContext } from "react";
import { User } from "../../interfaces";

interface UserProps {
  user?: User;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export const UserContext = createContext({} as UserProps);
