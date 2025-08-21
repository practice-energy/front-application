export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Добавляем security headers ко всем ответам
  const response = await context.next();
  const newResponse = new Response(response.body, response);
  
  // Добавляем security headers
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Для HTML ответов добавляем дополнительные заголовки
  const contentType = newResponse.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    newResponse.headers.set('Pragma', 'no-cache');
    newResponse.headers.set('Expires', '0');
  }
  
  return newResponse;
}
