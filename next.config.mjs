/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация для Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Отключаем серверные функции для статического экспорта
  experimental: {
    appDir: true,
  },
  
  // Настройки для Cloudflare Pages
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Настройки для статических файлов
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  
  // Настройки для PWA (если нужно)
  // async redirects() {
  //   return [
  //     {
  //       source: '/manifest.json',
  //       destination: '/api/manifest',
  //       permanent: true,
  //     },
  //   ]
  // },
  
  // Оптимизация сборки
  swcMinify: true,
  compress: true,
  
  // Настройки для TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Настройки для ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Настройки для анализатора бандла
  webpack: (config, { dev, isServer }) => {
    // Оптимизация для production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    
    return config
  },
  
  // Настройки для Cloudflare Pages
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Настройки для i18n (если используется)
  // i18n: {
  //   locales: ['en', 'ru'],
  //   defaultLocale: 'en',
  // },
}

export default nextConfig
