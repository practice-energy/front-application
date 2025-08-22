export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    // Proxy API requests to backend
    if (url.pathname.startsWith('/api/')) {
      return await proxyToBackend(request, url, env);
    }

    // Handle static assets from OpenNext build
    const isStaticAsset = url.pathname.startsWith('/_next/') ||
        url.pathname.startsWith('/static/') ||
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|json|webp|avif)$/);

    if (isStaticAsset) {
      try {
        const assetRequest = new Request(request);
        const assetResponse = await env.ASSETS.fetch(assetRequest);

        if (assetResponse.status !== 404 && assetResponse.status !== 403) {
          // Add caching headers for static assets
          const responseHeaders = new Headers(assetResponse.headers);

          // Set appropriate cache headers based on file type
          if (url.pathname.startsWith('/_next/static/')) {
            responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
          } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/)) {
            responseHeaders.set('Cache-Control', 'public, max-age=86400');
          } else if (url.pathname.match(/\.(js|css)$/)) {
            responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
            responseHeaders.set('Access-Control-Allow-Origin', '*');
          }

          return new Response(assetResponse.body, {
            status: assetResponse.status,
            headers: responseHeaders
          });
        }
      } catch (error) {
        console.error('Static asset error:', error, 'URL:', url.pathname);
      }
    }

    // Handle public files
    const isPublicFile = url.pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|json|webp|avif)$/) &&
        !url.pathname.startsWith('/api/') &&
        !url.pathname.startsWith('/_next/');

    if (isPublicFile) {
      try {
        const publicRequest = new Request(request);
        const publicResponse = await env.ASSETS.fetch(publicRequest);

        if (publicResponse.status !== 404 && publicResponse.status !== 403) {
          const responseHeaders = new Headers(publicResponse.headers);
          responseHeaders.set('Cache-Control', 'public, max-age=3600');
          return new Response(publicResponse.body, {
            status: publicResponse.status,
            headers: responseHeaders
          });
        }
      } catch (error) {
        console.error('Public file error:', error);
      }
    }

    // Handle Next.js data requests (RSC, _next/data, etc.)
    const isNextData = url.pathname.startsWith('/_next/data/') ||
        url.pathname.startsWith('/_next/') ||
        url.pathname.includes('.rsc') ||
        url.pathname.includes('.json');

    if (isNextData) {
      try {
        const dataRequest = new Request(request);
        const dataResponse = await env.ASSETS.fetch(dataRequest);

        if (dataResponse.status !== 404 && dataResponse.status !== 403) {
          return dataResponse;
        }
      } catch (error) {
        console.error('Next.js data error:', error);
      }
    }

    // For all other routes, serve the index.html for SPA routing
    return serveIndexHtml(env, corsHeaders);
  }
};

// Serve index.html for client-side routing
async function serveIndexHtml(env, corsHeaders) {
  try {
    // Try to get index.html from assets
    const indexRequest = new Request('https://example.com/index.html');
    const indexResponse = await env.ASSETS.fetch(indexRequest);

    if (indexResponse.status !== 404 && indexResponse.status !== 403) {
      const responseHeaders = new Headers(indexResponse.headers);
      responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
      responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');

      // Add CORS headers
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });

      return new Response(indexResponse.body, {
        status: indexResponse.status,
        headers: responseHeaders
      });
    }
  } catch (error) {
    console.error('Index.html fetch error:', error);
  }

  // Fallback HTML if index.html is not found
  const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Practice Energy</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Practice Energy</h1>
        <p>Application is loading...</p>
        <p>If this persists, please check your deployment.</p>
    </div>
</body>
</html>`;

  return new Response(fallbackHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...corsHeaders
    }
  });
}

// Proxy function for backend API calls
async function proxyToBackend(request, url, env) {
  const backendUrl = env.BACKEND_URL || 'https://api.practice.energy';

  try {
    const backendRequestUrl = new URL(url.pathname + url.search, backendUrl);

    // Copy headers from original request
    const headers = new Headers();
    for (const [key, value] of request.headers) {
      const lowerKey = key.toLowerCase();
      // Skip Cloudflare-specific headers
      if (!['host', 'cf-connecting-ip', 'cf-ray', 'cf-ipcountry', 'cf-worker', 'cf-request-id'].includes(lowerKey)) {
        headers.set(key, value);
      }
    }

    // Add forwarding headers
    const clientIP = request.headers.get('CF-Connecting-IP') ||
        request.headers.get('X-Forwarded-For') ||
        'unknown';
    headers.set('X-Forwarded-For', clientIP);
    headers.set('X-Forwarded-Host', request.headers.get('host') || '');
    headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
    headers.set('User-Agent', request.headers.get('User-Agent') || 'Cloudflare-Worker');

    // Create backend request
    const backendRequest = new Request(backendRequestUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ?
          await request.clone().arrayBuffer() : undefined,
    });

    // Execute request with timeout
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Backend timeout')), 30000)
    );

    const backendResponse = await Promise.race([
      fetch(backendRequest),
      timeoutPromise
    ]);

    // Return response with CORS headers
    const responseHeaders = new Headers(backendResponse.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Backend proxy error:', error);

    // Different error responses based on error type
    if (error.message === 'Backend timeout') {
      return new Response(JSON.stringify({
        error: 'Gateway Timeout',
        message: 'Backend service took too long to respond',
        timestamp: new Date().toISOString()
      }), {
        status: 504,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    return new Response(JSON.stringify({
      error: 'Service Unavailable',
      message: 'The backend service is currently unavailable',
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Health check endpoint
async function handleHealthCheck() {
  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}