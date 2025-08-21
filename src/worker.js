export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
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
    
    // Для всех остальных маршрутов возвращаем SPA fallback
    if (!isStaticAsset(url.pathname)) {
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
        // Let the client-side router handle the route
        window.location.href = window.location.pathname;
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
    
    // Для статических файлов возвращаем 404 (они должны быть в Pages)
    return new Response('Not Found', { status: 404 });
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
