import type { NextConfig } from 'next'

const NGROK = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
