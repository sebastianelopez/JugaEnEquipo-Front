import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";
import https from "https";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Create custom HTTPS agent that ignores SSL certificate errors in development
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "production", // Only verify certs in production
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return httpProxyMiddleware(req, res, {
    target: "https://api.jugaenequipo.com/api",
    pathRewrite: [
      {
        patternStr: "^/api/proxy",
        replaceStr: "",
      },
    ],
    changeOrigin: true,
    secure: !isDevelopment, // Disable SSL certificate verification in development only
    agent: httpsAgent, // Use custom HTTPS agent
  });
}
