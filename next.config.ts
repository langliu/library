import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // 图片尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 支持的域名列表
    domains: ['localhost'],
    // 图片格式配置
    formats: ['image/webp', 'image/avif'],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 更精确的远程模式配置
    remotePatterns: [
      // 开发环境 - HTTP localhost
      {
        hostname: 'localhost',
        pathname: '/api/image/**',
        port: '3000',
        protocol: 'http',
      },
      // 开发环境 - HTTPS localhost
      {
        hostname: 'localhost',
        pathname: '/api/image/**',
        protocol: 'https',
      },
      // 如果你有生产环境域名，可以在这里添加
      // {
      //   protocol: 'https',
      //   hostname: 'your-domain.com',
      //   pathname: '/api/image/**',
      // },
    ],
  },
}

export default nextConfig
