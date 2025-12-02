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
  
  // Check if this is a backoffice endpoint
  const isBackofficeEndpoint = req.url?.includes("/backoffice/");
  
  // Backoffice endpoints: {{host}}/backoffice/... (no /api/)
  // Other endpoints: {{host}}/api/...
  const target = isBackofficeEndpoint
    ? "https://api.jugaenequipo.com" // No /api for backoffice
    : "https://api.jugaenequipo.com/api"; // With /api for others
  
  const pathRewrite = isBackofficeEndpoint
    ? [
        {
          patternStr: "^/api/proxy",
          replaceStr: "", // /api/proxy/backoffice/login -> /backoffice/login
        },
      ]
    : [
        {
          patternStr: "^/api/proxy",
          replaceStr: "", // /api/proxy/endpoint -> /endpoint (will be prefixed with /api by target)
        },
      ];

  return httpProxyMiddleware(req, res, {
    target,
    pathRewrite,
    changeOrigin: true,
    secure: !isDevelopment, // Disable SSL certificate verification in development only
    agent: httpsAgent, // Use custom HTTPS agent
  });
}
