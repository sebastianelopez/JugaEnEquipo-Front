export const decodeUserIdByToken = (token: string): string => {
  // Split the token into its three parts
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  // Decode the second part (payload)
  const payload = parts[1];
  const normalized = Buffer.from(
    payload.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("binary");
  const decodedString = decodeURIComponent(
    Array.from(normalized)
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );

  // Extract the user ID from the decoded payload
  const payloadMap = JSON.parse(decodedString);
  const decodedId = payloadMap["id"];

  if (!decodedId) {
    throw new Error("ID not found in token payload");
  }
  return decodedId;
};
