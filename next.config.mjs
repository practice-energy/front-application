/** @type {import('next').NextConfig} */
const nextConfig = {
  // Настройки для изображений
  images: {
    unoptimized: true, // Отключаем оптимизацию изображений для статического экспорта
    domains: ['localhost', 'app.practice.energy', 'staging.practice.energy', 'preview.practice.energy']
  },
  
  // Настройки для статических ресурсов
  experimental: {
    // Включаем поддержку статического контента
  },
  
  // Настройки для Cloudflare Pages
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
