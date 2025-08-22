#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Vercel build to Cloudflare Workers...');

// Проверяем, что Vercel сборка существует
if (!fs.existsSync('.vercel/output')) {
  console.log('❌ Vercel build not found. Running build first...');
  try {
    execSync('pnpm build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Копируем статические файлы из Vercel сборки в public
console.log('📁 Copying static files from Vercel build...');
const staticDir = '.vercel/output/static';
const publicDir = 'public';

if (fs.existsSync(staticDir)) {
  // Создаем public директорию если её нет
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Удаляем существующую папку _next из public, чтобы избежать конфликтов
  if (fs.existsSync(`${publicDir}/_next`)) {
    execSync(`rm -rf ${publicDir}/_next`, { stdio: 'inherit' });
    console.log('🗑️  Removed existing _next folder from public');
  }

  // Копируем все файлы из Vercel сборки
  try {
    // Копируем все файлы и папки из статической директории
    execSync(`cp -r ${staticDir}/* ${publicDir}/`, { stdio: 'inherit' });
    console.log('✅ Static files copied successfully');
  } catch (error) {
    console.log('⚠️  Some files may not have been copied, but continuing...');
  }
}

// Проверяем наличие _worker.js
if (!fs.existsSync('_worker.js')) {
  console.log('⚠️  _worker.js not found, but continuing with deployment...');
}

// Деплой на Cloudflare
console.log('🌐 Deploying to Cloudflare Workers...');
try {
  execSync('wrangler deploy --env production', { stdio: 'inherit' });
  console.log('✅ Deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
