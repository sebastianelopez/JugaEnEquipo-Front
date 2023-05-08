import { createContext } from "react";
import { User } from "../../interfaces";

interface AuthProps {
  isLoggedIn: boolean;
  user?: User;

  //Methods
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (    
    nickname: string,
    name: string,
    lastname: string,
    email: string,    
  ) => Promise<{
    hasError: boolean;
    message?: string;
  }>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthProps);
