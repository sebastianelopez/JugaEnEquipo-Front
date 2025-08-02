import { User } from "./user";

export interface Team {
  id: string;
  name: string;
  users: User[];
  achievements?: string[];
  profileImage?: string;
}
