/**
 * Utility functions for getting rank images
 * Supports multiple strategies for loading rank images
 */

interface RankImageConfig {
  gameId: string;
  gameName: string;
  rankId?: string;
  rankName: string;
  level?: number;
}

/**
 * Strategy 1: CDN with predictable structure
 * Assumes images are hosted at: /images/ranks/{gameId}/{rankId}.png
 * or: /images/ranks/{gameName}/{rankName}.png
 */
const getRankImageFromCDN = (config: RankImageConfig): string => {
  const { gameId, gameName, rankId, rankName } = config;
  
  // Option A: Use gameId and rankId
  if (rankId) {
    return `/images/ranks/${gameId}/${rankId}.png`;
  }
  
  // Option B: Use gameName and rankName (normalized)
  const normalizedGameName = gameName.toLowerCase().replace(/\s+/g, '-');
  const normalizedRankName = rankName.toLowerCase().replace(/\s+/g, '-');
  return `/images/ranks/${normalizedGameName}/${normalizedRankName}.png`;
};

/**
 * Strategy 2: External CDN (e.g., Cloudinary, Imgur, etc.)
 * Example: https://res.cloudinary.com/your-cloud/image/upload/ranks/{gameId}/{rankId}.png
 */
const getRankImageFromExternalCDN = (config: RankImageConfig): string => {
  const { gameId, rankId, rankName } = config;
  const CDN_BASE_URL = process.env.NEXT_PUBLIC_RANK_IMAGES_CDN || 'https://your-cdn.com';
  
  if (rankId) {
    return `${CDN_BASE_URL}/ranks/${gameId}/${rankId}.png`;
  }
  
  const normalizedRankName = rankName.toLowerCase().replace(/\s+/g, '-');
  return `${CDN_BASE_URL}/ranks/${gameId}/${normalizedRankName}.png`;
};

/**
 * Strategy 3: Local mapping (for small number of ranks)
 * Similar to how game images are handled
 */
const getRankImageFromLocalMap = (config: RankImageConfig): string => {
  const { gameName, rankName, level } = config;
  
  // Normalize rank name (trim, handle case variations)
  const normalizedRankName = rankName?.trim() || "";
  
  // Valorant uses format: {RankName}_{Level}_Rank.png
  // Example: Gold_1_Rank.png, Gold_2_Rank.png, Gold_3_Rank.png
  // Radiant doesn't have levels, so it's just Radiant_Rank.png
  const normalizedGameName = gameName?.trim().toLowerCase() || "";
  if (normalizedGameName === "valorant") {
    // Capitalize first letter, lowercase rest
    const rankNameFormatted = normalizedRankName.charAt(0).toUpperCase() + normalizedRankName.slice(1).toLowerCase();
    
    // Radiant doesn't have levels
    if (rankNameFormatted.toLowerCase() === "radiant") {
      return "/images/ranks/valorant/Radiant_Rank.png";
    }
    
    // Other ranks have levels 1, 2, 3
    // Use level from config, default to 1 if not provided
    // API level might be 0-based or different, so we convert it
    let rankLevel = 1;
    if (level !== undefined && level !== null) {
      // If level is 0, use 1. If level is 1-3, use as is. If > 3, clamp to 3
      if (level === 0) {
        rankLevel = 1;
      } else {
        rankLevel = Math.max(1, Math.min(3, level));
      }
    }
    
    return `/images/ranks/valorant/${rankNameFormatted}_${rankLevel}_Rank.png`;
  }
  
  // Counter-Strike 2 uses format: {rank-name}-{level}.png or {rank-name}.png
  // Example: silver-1.png, gold-nova-1.png, global-elite.png
  if (normalizedGameName === "counter-strike 2" || normalizedGameName === "counter-strike-2") {
    // Convert rank name to lowercase and replace spaces with hyphens
    let rankFileName = normalizedRankName.toLowerCase().replace(/\s+/g, '-');
    
    // Handle specific rank name mappings
    const cs2RankMap: Record<string, string> = {
      "silver i": "silver-1",
      "silver ii": "silver-2",
      "silver iii": "silver-3",
      "silver iv": "silver-4",
      "silver elite": "silver-elite",
      "silver elite master": "silver-elite-master",
      "gold nova i": "gold-nova-1",
      "gold nova ii": "gold-nova-2",
      "gold nova iii": "gold-nova-3",
      "gold nova iv": "gold-nova-4",
      "master guardian i": "master-guardian-1",
      "master guardian ii": "master-guardian-2",
      "master guardian elite": "master-guardian-elite",
      "distinguished master guardian": "distinguished-master-guardian",
      "legendary eagle": "legendary-eagle",
      "legendary eagle master": "legendary-eagle-master",
      "supreme master first class": "supreme-master-first-class",
      "global elite": "global-elite",
    };
    
    const mappedRank = cs2RankMap[rankFileName] || rankFileName;
    return `/images/ranks/counter-strike-2/${mappedRank}.png`;
  }
  
  // Dota 2 uses format: SeasonalRank{rank}-{level}.webp
  // Example: SeasonalRank1-1.webp, SeasonalRank7-5.webp, SeasonalRankTop1.webp
  // Mapping: Herald=1, Guardian=2, Crusader=3, Archon=4, Legend=5, Ancient=6, Divine=7, Immortal=Top
  if (normalizedGameName === "dota 2" || normalizedGameName === "dota-2") {
    const dota2RankMap: Record<string, string> = {
      "herald": "SeasonalRank1",
      "guardian": "SeasonalRank2",
      "crusader": "SeasonalRank3",
      "archon": "SeasonalRank4",
      "legend": "SeasonalRank5",
      "ancient": "SeasonalRank6",
      "divine": "SeasonalRank7",
      "immortal": "SeasonalRankTop",
    };
    
    const rankKey = normalizedRankName.toLowerCase();
    const rankPrefix = dota2RankMap[rankKey];
    
    if (rankPrefix) {
      // Use level from config, default to 1 if not provided
      // For Immortal (Top), use level directly (1, 2, 4)
      // For others, use level 1-5
      let rankLevel = 1;
      if (rankPrefix === "SeasonalRankTop") {
        // Immortal ranks: Top1, Top2, Top4
        if (level === 1 || level === 2 || level === 4) {
          rankLevel = level;
        } else {
          rankLevel = 1;
        }
        return `/images/ranks/dota-2/${rankPrefix}${rankLevel}.webp`;
      } else {
        // Regular ranks: use level 1-5, clamp to valid range
        rankLevel = level !== undefined && level !== null ? Math.max(1, Math.min(5, level)) : 1;
        return `/images/ranks/dota-2/${rankPrefix}-${rankLevel}.webp`;
      }
    }
    
    // Fallback for Dota 2
    return `/images/ranks/dota-2/SeasonalRank1-1.webp`;
  }
  
  // Map of gameName -> rankName -> image path (for other games)
  const rankImageMap: Record<string, Record<string, string>> = {
    "League of Legends": {
      "Iron": "/images/ranks/league-of-legends/iron.png",
      "Bronze": "/images/ranks/league-of-legends/bronze.png",
      "Silver": "/images/ranks/league-of-legends/silver.png",
      "Gold": "/images/ranks/league-of-legends/gold.png",
      "Platinum": "/images/ranks/league-of-legends/platinum.png",
      "Emerald": "/images/ranks/league-of-legends/emerald.png",
      "Diamond": "/images/ranks/league-of-legends/diamond.png",
      "Master": "/images/ranks/league-of-legends/master.png",
      "Grandmaster": "/images/ranks/league-of-legends/grandmaster.png",
      "Challenger": "/images/ranks/league-of-legends/challenger.png",
      // Case variations
      "iron": "/images/ranks/league-of-legends/iron.png",
      "bronze": "/images/ranks/league-of-legends/bronze.png",
      "silver": "/images/ranks/league-of-legends/silver.png",
      "gold": "/images/ranks/league-of-legends/gold.png",
      "platinum": "/images/ranks/league-of-legends/platinum.png",
      "emerald": "/images/ranks/league-of-legends/emerald.png",
      "diamond": "/images/ranks/league-of-legends/diamond.png",
      "master": "/images/ranks/league-of-legends/master.png",
      "grandmaster": "/images/ranks/league-of-legends/grandmaster.png",
      "challenger": "/images/ranks/league-of-legends/challenger.png",
    },
    // Add more games as needed
  };
  
  const gameRanks = rankImageMap[gameName];
  if (gameRanks) {
    // Try exact match first
    if (gameRanks[normalizedRankName]) {
      return gameRanks[normalizedRankName];
    }
    // Try case-insensitive match
    const lowerRankName = normalizedRankName.toLowerCase();
    const matchingKey = Object.keys(gameRanks).find(
      key => key.toLowerCase() === lowerRankName
    );
    if (matchingKey && gameRanks[matchingKey]) {
      return gameRanks[matchingKey];
    }
  }
  
  // Fallback: try CDN structure (reuse normalizedGameName from above)
  const normalizedGameNameForCDN = normalizedGameName.replace(/\s+/g, '-');
  const normalizedRankNameForCDN = normalizedRankName.toLowerCase().replace(/\s+/g, '-');
  return `/images/ranks/${normalizedGameNameForCDN}/${normalizedRankNameForCDN}.png`;
};

/**
 * Main function to get rank image
 * Uses the strategy defined by NEXT_PUBLIC_RANK_IMAGE_STRATEGY env variable
 * Options: 'cdn', 'external-cdn', 'local-map'
 * Default: 'local-map' (easiest to maintain with local images)
 */
export const getRankImage = (config: RankImageConfig): string => {
  const strategy = process.env.NEXT_PUBLIC_RANK_IMAGE_STRATEGY || 'local-map';
  
  switch (strategy) {
    case 'external-cdn':
      return getRankImageFromExternalCDN(config);
    case 'cdn':
      return getRankImageFromCDN(config);
    case 'local-map':
    default:
      // Try local map first, fallback to CDN if not found
      const localMapResult = getRankImageFromLocalMap(config);
      if (localMapResult !== "/images/image-placeholder.png") {
        return localMapResult;
      }
      // Fallback to CDN structure
      return getRankImageFromCDN(config);
  }
};

/**
 * Helper function to get rank image from Player's gameRank
 */
export const getRankImageFromPlayer = (
  gameName: string,
  gameId: string,
  gameRank?: { id: string; name: string; level: number }
): string => {
  if (!gameRank) {
    return "/images/image-placeholder.png";
  }
  
  return getRankImage({
    gameId,
    gameName,
    rankId: gameRank.id,
    rankName: gameRank.name,
    level: gameRank.level,
  });
};

/**
 * Helper function to get rank image from Rank interface
 */
export const getRankImageFromRank = (
  gameName: string,
  gameId: string,
  rank: { id: string; rankName: string }
): string => {
  return getRankImage({
    gameId,
    gameName,
    rankId: rank.id,
    rankName: rank.rankName,
  });
};

