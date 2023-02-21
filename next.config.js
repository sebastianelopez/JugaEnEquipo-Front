/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'es', 'pt'],
    defaultLocale: 'en'
  },
  images: {
    domains: ['media-exp1.licdn.com', 'www.muylinux.com'],
  },
}

module.exports = nextConfig
