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
  
  // Настройки для Cloudflare Workers
  experimental: {
    // Включаем поддержку серверных компонентов
  },
  
  // Внешние пакеты для серверных компонентов
  serverExternalPackages: [],
  
  // Настройки для Cloudflare
  trailingSlash: true,
  
  // Настройки для статических ресурсов  
  assetPrefix: '',

  // Игнорируем ошибки TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Настройки для Cloudflare Workers (без статического экспорта)
  // output: 'export', // Убираем статический экспорт
  
  // Директория для сборки
  distDir: '.next',
  
  // Настройки для PWA (если нужно)
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },
};

export default nextConfig;
