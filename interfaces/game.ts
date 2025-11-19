export interface Game {
  id: string;
  name: string;
  description?: string;
  minPlayersQuantity: number;
  maxPlayersQuantity: number;
  isVisible: boolean;
  image?: string;
}
