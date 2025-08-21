export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const nextjsServerUrl = env.NEXTJS_SERVER_URL;
    
    // Обработка корневого запроса
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Front Application</title>
    <meta name="description" content="Front Application">
    <link rel="icon" href="/favicon.ico">
</head>
<body>
    <div id="root">
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
            <div style="text-align: center;">
                <h1>Loading...</h1>
                <p>Please wait while the application loads.</p>
            </div>
        </div>
    </div>
    <script>
        // Redirect to the main application
        window.location.href = '/app';
    </script>
</body>
</html>`, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    // Кэшируем статические ассеты
    if (isStaticAsset(url.pathname)) {
      const cache = caches.default;
      const cacheKey = request.url;
      
      // Пробуем получить из кэша
      let response = await cache.match(cacheKey);
      
      if (response) {
        return response;
      }
      
      // Проксируем к Next.js
      response = await proxyToNextjs(request, nextjsServerUrl);
      
      // Кэшируем статические файлы
      if (response.status === 200 && isCacheableAsset(url.pathname)) {
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }
      
      return response;
    }
    
    // Для HTML страниц не кэшируем (динамический контент)
    return await proxyToNextjs(request, nextjsServerUrl);
  }
}

// Проксирование к Next.js серверу
async function proxyToNextjs(request, nextjsServerUrl) {
  const url = new URL(request.url);
  const targetUrl = new URL(url.pathname + url.search, nextjsServerUrl);
  
  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: cleanHeaders(request.headers),
    body: request.body,
    redirect: 'follow'
  });
  
  try {
    const response = await fetch(newRequest);
    
    // Корректируем заголовки если нужно
    return fixResponseHeaders(response);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Gateway Error', { status: 502 });
  }
}

// Проверка是否是 статический файл
function isStaticAsset(pathname) {
  return pathname.includes('.') && 
         (pathname.startsWith('/_next/') ||
          pathname.endsWith('.css') ||
          pathname.endsWith('.js') ||
          pathname.endsWith('.png') ||
          pathname.endsWith('.jpg') ||
          pathname.endsWith('.jpeg') ||
          pathname.endsWith('.gif') ||
          pathname.endsWith('.svg') ||
          pathname.endsWith('.ico') ||
          pathname.endsWith('.webp') ||
          pathname.endsWith('.woff') ||
          pathname.endsWith('.woff2') ||
          pathname.endsWith('.ttf'));
}

// Проверка можно ли кэшировать asset
function isCacheableAsset(pathname) {
  const cacheableExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf'];
  return cacheableExtensions.some(ext => pathname.endsWith(ext));
}

// Очистка заголовков запроса
function cleanHeaders(headers) {
  const newHeaders = new Headers();
  
  for (const [key, value] of headers) {
    // Убираем облачные заголовки которые могут мешать
    if (!key.startsWith('cf-') && 
        !key.startsWith('x-forwarded-') && 
        key !== 'host' &&
        key !== 'connection') {
      newHeaders.set(key, value);
    }
  }
  
  // Добавляем полезные заголовки
  newHeaders.set('x-forwarded-host', headers.get('host'));
  
  return newHeaders;
}

// Корректировка заголовков ответа
function fixResponseHeaders(response) {
  const newHeaders = new Headers(response.headers);
  
  // Убираем ненужные заголовки от бэкенда
  newHeaders.delete('x-powered-by');
  newHeaders.delete('server');
  
  // Добавляем security headers
  newHeaders.set('x-content-type-options', 'nosniff');
  newHeaders.set('x-frame-options', 'DENY');
  newHeaders.set('referrer-policy', 'strict-origin-when-cross-origin');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}