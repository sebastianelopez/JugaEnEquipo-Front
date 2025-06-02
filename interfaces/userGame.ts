import { Game } from "./game";

export interface UserGame extends Game {
    elo: number;
}