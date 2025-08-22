/** @type {import('next').NextConfig} */
const nextConfig = {
  // Настройки для изображений
  images: {
    unoptimized: true, // Отключаем оптимизацию для Cloudflare
    domains: ['localhost', 'app.practice.energy', 'staging.practice.energy', 'preview.practice.energy'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Настройки для Cloudflare через Vercel
  experimental: {
    // Включаем поддержку серверных компонентов
  },
  
  // Внешние пакеты для серверных компонентов
  serverExternalPackages: [],
  
  // Настройки для Cloudflare
  trailingSlash: true,
  
  // Настройки для кэширования
  generateEtags: false,
  
  // Настройки для статических ресурсов
  assetPrefix: '',
  
  // Игнорируем ошибки TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Настройки для PWA (если нужно)
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },
};

export default nextConfig;
