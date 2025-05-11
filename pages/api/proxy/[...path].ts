import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return httpProxyMiddleware(req, res, {
    target: 'https://api.jugaenequipo.com/api',
    pathRewrite: [
      {
        patternStr: '^/api/proxy',
        replaceStr: '',
      },
    ],
    changeOrigin: true,
  });
}