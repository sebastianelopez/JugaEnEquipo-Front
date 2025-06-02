import { Game } from "./game";
import { UserGame } from "./userGame";

export interface User{
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    profileImage?: string;
    role?: string;
    country?: string;
    games?: UserGame[];
}