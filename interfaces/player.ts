export interface GameRank {
  id: string;
  name: string;
  level: number;
}

export interface Player {
  id: string;
  username: string; // Username del usuario propietario
  gameId: string;
  gameName: string;
  verified: boolean;
  verifiedAt: string | null;
  isOwnershipVerified: boolean;
  ownershipVerifiedAt: string | null;
  accountData: {
    // RIOT Games
    region?: string;
    username?: string;
    tag?: string;
    // STEAM
    steamId?: string;
  };
  gameRank?: GameRank;
  gameRoleIds?: string[]; // Para crear/actualizar (no viene en la respuesta del search)
  createdAt?: string;
  updatedAt?: string;
}
