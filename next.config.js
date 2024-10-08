/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // The experimental.appDir option is no longer needed in Next.js 14+
}

module.exports = nextConfig