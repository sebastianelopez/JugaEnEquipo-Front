/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'es', 'pt'],
    defaultLocale: 'en'
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
   // domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig
