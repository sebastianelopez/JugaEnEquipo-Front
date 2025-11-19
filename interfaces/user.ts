import { Game } from "./game";
import { UserGame } from "./userGame";

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  profileImage?: string;
  description?: string;
  role?: string;
  country?: string;
  games?: UserGame[];
  createdAt: string;
}
