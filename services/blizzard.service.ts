import { api } from "../lib/api";
import Cookies from "js-cookie";
import { getToken } from "./auth.service";
import { decodeUserIdByToken } from "../utils/decodeIdByToken";

interface BlizzardToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface BlizzardUserProfile {
  id: number;
  battletag: string;
  username?: string;
  achievements?: any[];
  characters?: any[];
  // Add more fields as needed based on API response
}

// You need to register your app on Blizzard Developer Portal to get these
const BLIZZARD_CLIENT_ID = process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_ID || "";
const BLIZZARD_CLIENT_SECRET = process.env.BLIZZARD_CLIENT_SECRET || "";
const REDIRECT_URI =
  process.env.NEXT_PUBLIC_APP_URL + "/api/auth/blizzard/callback";

export const blizzardService = {
  // Step 1: Generate OAuth authorization URL
  getAuthorizationUrl: (state: string) => {
    const params = new URLSearchParams({
      client_id: BLIZZARD_CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: "wow.profile sc2.profile d3.profile",
      state,
    });

    return `https://oauth.battle.net/authorize?${params.toString()}`;
  },

  // Step 2: Exchange authorization code for access token
  getAccessToken: async (code: string) => {
    try {
      const formData = new FormData();
      formData.append("grant_type", "authorization_code");
      formData.append("code", code);
      formData.append("redirect_uri", REDIRECT_URI);

      const response = await fetch("https://oauth.battle.net/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${BLIZZARD_CLIENT_ID}:${BLIZZARD_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: formData,
      });

      const data: BlizzardToken = await response.json();

      // Store the Blizzard token in cookies for future use
      Cookies.set("blizzard_token", data.access_token, {
        secure: true,
        sameSite: "strict",
        expires: data.expires_in / (60 * 60 * 24), // Convert seconds to days
      });

      return data;
    } catch (error) {
      console.error("Error getting Blizzard access token:", error);
      throw error;
    }
  },

  // Step 3: Get user profile to verify account ownership
  getUserProfile: async (region = "us") => {
    try {
      const blizzardToken = Cookies.get("blizzard_token");

      if (!blizzardToken) {
        throw new Error("No Blizzard token found");
      }

      const response = await fetch(
        `https://${region}.api.blizzard.com/oauth/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${blizzardToken}`,
          },
        }
      );

      const data: BlizzardUserProfile = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting Blizzard user profile:", error);
      throw error;
    }
  },

  // Step 4: Link Blizzard account to user account in your system
  linkBlizzardAccount: async (
    userId: string,
    blizzardId: number,
    battletag: string
  ) => {
    const token = await getToken();
    // Store the connection between your user and their Blizzard account
    return api.post<{ success: boolean }>(
      "/user/link-blizzard-account",
      { userId, blizzardId, battletag },
      undefined,
      token
    );
  },

  // Get World of Warcraft characters
  getWowCharacters: async (region = "us") => {
    try {
      const blizzardToken = Cookies.get("blizzard_token");
      const profile = await blizzardService.getUserProfile(region);

      const response = await fetch(
        `https://${region}.api.blizzard.com/profile/wow/character?namespace=profile-${region}`,
        {
          headers: {
            Authorization: `Bearer ${blizzardToken}`,
          },
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Error getting WoW characters:", error);
      throw error;
    }
  },

  // Get Diablo 3 profile
  getDiabloProfile: async (region = "us") => {
    try {
      const blizzardToken = Cookies.get("blizzard_token");
      const profile = await blizzardService.getUserProfile(region);

      const response = await fetch(
        `https://${region}.api.blizzard.com/d3/profile/${profile.battletag.replace(
          "#",
          "-"
        )}/?locale=en_US`,
        {
          headers: {
            Authorization: `Bearer ${blizzardToken}`,
          },
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Error getting Diablo profile:", error);
      throw error;
    }
  },

  // Get StarCraft 2 profile
  getStarcraft2Profile: async (region = "us") => {
    try {
      const blizzardToken = Cookies.get("blizzard_token");
      const profile = await blizzardService.getUserProfile(region);

      const response = await fetch(
        `https://${region}.api.blizzard.com/sc2/profile/user?locale=en_US`,
        {
          headers: {
            Authorization: `Bearer ${blizzardToken}`,
          },
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Error getting StarCraft 2 profile:", error);
      throw error;
    }
  },

  // Verify account ownership
  verifyAccountOwnership: async () => {
    try {
      // This gets the profile directly from Blizzard using the OAuth token
      // which confirms the user is logged in to that Blizzard account
      const profile = await blizzardService.getUserProfile();

      // Get the user ID from your system
      const token = await getToken();
      if (!token) {
        console.error("No token found for user verification");
        return false;
      }
      const userId =
        decodeUserIdByToken(token);

      // Check if this Blizzard account is linked to this user
      const verification = await api.get<{ isVerified: boolean }>(
        `/user/verify-blizzard-account/${profile.id}/${userId}`,
        {},
        token
      );

      return verification.isVerified;
    } catch (error) {
      console.error("Error verifying account ownership:", error);
      return false;
    }
  },
};
