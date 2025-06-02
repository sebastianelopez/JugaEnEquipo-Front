import { NextApiRequest, NextApiResponse } from "next";
import { blizzardService } from "../../../../services/blizzard.service";
import { getToken } from "../../../../services/auth.service";
import { decodeUserIdByToken } from "../../../../utils/decodeIdByToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { code, state } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    // Exchange the code for an access token
    const tokenData = await blizzardService.getAccessToken(code);

    // Get the Blizzard user profile
    const blizzardProfile = await blizzardService.getUserProfile();

    // Get the user ID from your system
    const token = await getToken();
    if (!token) return;
    const userId = decodeUserIdByToken(token);

    if (userId === null) return;
    // Link the Blizzard account to the user's account
    await blizzardService.linkBlizzardAccount(
      userId!,
      blizzardProfile.id,
      blizzardProfile.battletag
    );

    // Redirect back to the profile page or a success page
    res.redirect("/profile?blizzard_linked=true");
  } catch (error) {
    console.error("Error in Blizzard OAuth callback:", error);
    res.redirect("/profile?error=blizzard_auth_failed");
  }
}
