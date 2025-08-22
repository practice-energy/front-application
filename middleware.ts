import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Получаем origin из заголовка или устанавливаем дефолтный
  const origin = request.headers.get('origin') || '*';
  
  // Создаем response
  const response = NextResponse.next();

  // Настройки CORS
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Обработка preflight запросов
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  // Проверка аутентификации для защищенных маршрутов
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/api/') && 
    !request.nextUrl.pathname.startsWith('/api/health');
  
  if (isProtectedRoute) {
    const authHeader = request.headers.get('authorization');
    
    // В реальном приложении здесь будет проверка JWT токена
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401, headers: response.headers }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
