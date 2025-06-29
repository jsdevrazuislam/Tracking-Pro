/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: ['http://192.168.1.101:3000', 'http://192.168.8.76:3000', 'https://87f5-103-153-155-209.ngrok-free.app'],
  },
}

export default nextConfig
