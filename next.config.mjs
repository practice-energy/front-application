/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация для Cloudflare Pages
  trailingSlash: true,
  images: {
    unoptimized: true,
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
