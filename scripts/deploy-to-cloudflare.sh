#!/bin/bash

echo "🚀 Deploying Vercel build to Cloudflare Workers..."

# Проверяем, что Vercel сборка существует
if [ ! -d ".vercel/output" ]; then
    echo "❌ Vercel build not found. Running build first..."
    pnpm build
fi

# Копируем статические файлы из Vercel сборки
echo "📁 Copying static files from Vercel build..."
cp -r .vercel/output/static/* public/ 2>/dev/null || true

# Копируем _worker.js если он есть
if [ -f "_worker.js" ]; then
    echo "📄 Found _worker.js, ready for deployment"
else
    echo "⚠️  _worker.js not found, creating basic worker..."
    cat > _worker.js << 'EOF'
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Обработка API routes
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({
        message: 'API endpoint',
        path: url.pathname,
        method: request.method
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Обработка статических файлов
    if (url.pathname.includes('.')) {
      return env.ASSETS.fetch(request);
    }
    
    // SPA fallback
    return env.ASSETS.fetch(new Request(new URL('/index.html', request.url)));
  }
};
EOF
fi

# Деплой на Cloudflare
echo "🌐 Deploying to Cloudflare Workers..."
wrangler deploy --env production

echo "✅ Deployment completed!"
