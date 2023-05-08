import { Game } from "./game";

export interface User{
    _id: string;
    nickname: string;
    name: string;
    lastname: string;
    password: string;
    email: string;
    profileImage: string;
    role: string;
    country: string;
    games: Game[];
}