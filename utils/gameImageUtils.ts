import counterstrikeLogo from "../assets/logos/counterstrike.webp";
import dotaLogo from "../assets/logos/dotalogo.jpg";
import lolLogo from "../assets/logos/lol.jpg";
import valorantLogo from "../assets/logos/valorant.png";

/**
 * Maps game names to their local logo images
 * @param gameName - The name of the game
 * @returns The image path or placeholder if not found
 */
export const getGameImage = (gameName: string | undefined | null): string => {
  if (!gameName) {
    return "/images/image-placeholder.png";
  }

  const normalizedName = gameName.trim();

  // Map game names to their local images
  const gameImageMap: Record<string, string> = {
    "Counter-Strike 2": counterstrikeLogo.src,
    "CS:GO": counterstrikeLogo.src,
    "Counter Strike 2": counterstrikeLogo.src,
    "Dota 2": dotaLogo.src,
    "League of Legends": lolLogo.src,
    "Valorant": valorantLogo.src,
  };

  return gameImageMap[normalizedName] || "/images/image-placeholder.png";
};

