import { log } from "console";

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
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    // Proxy API requests to backend
    if (url.pathname.startsWith('/api/')) {
      return await proxyToBackend(request, url, env);
    }

    // Handle static files from OpenNext output
    const isStaticAsset = url.pathname.startsWith('/_next/') ||
        url.pathname.startsWith('/static/') ||
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|json)$/);

    if (isStaticAsset) {
      try {
        // Try to serve from OpenNext assets
        const assetRequest = new Request(request);
        const assetResponse = await env.ASSETS.fetch(assetRequest);

        if (assetResponse.status !== 404) {
          // Add caching headers for static assets
          const responseHeaders = new Headers(assetResponse.headers);
          responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

          if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
            responseHeaders.set('Access-Control-Allow-Origin', '*');
          }

          return new Response(assetResponse.body, {
            status: assetResponse.status,
            headers: responseHeaders
          });
        }
      } catch (error) {
        console.log('Static asset error:', error, 'URL:', request.url);
      }
    }

    // Handle public files
    const isPublicFile = url.pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|json)$/) &&
        !url.pathname.startsWith('/api/');

    if (isPublicFile) {
      try {
        const publicRequest = new Request(request);
        const publicResponse = await env.ASSETS.fetch(publicRequest);

        if (publicResponse.status !== 404) {
          return publicResponse;
        }
      } catch (error) {
        console.log('Public file error:', error);
      }
    }

    // For all other routes, return the fallback HTML (SPA behavior)
    // This handles client-side routing for Next.js
    return serveFallbackHtml(env, corsHeaders);
  }
};

// Serve fallback HTML for SPA routing
async function serveFallbackHtml(env, corsHeaders) {
  try {
    // Try to get the index.html from assets
    const indexRequest = new Request('https://example.com/index.html');
    const indexResponse = await env.ASSETS.fetch(indexRequest);

    if (indexResponse.status !== 404) {
      const responseHeaders = new Headers(indexResponse.headers);
      responseHeaders.set('Content-Type', 'text/html');
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });

      return new Response(indexResponse.body, {
        status: indexResponse.status,
        headers: responseHeaders
      });
    }
  } catch (error) {
    console.log('Index.html not found in assets, using fallback');
  }

  // Fallback HTML if index.html is not found
  const html = `<!DOCTYPE html><html lang="en"><head>...your HTML content...</body></html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      ...corsHeaders
    }
  });
}

// Proxy function for backend API calls
async function proxyToBackend(request, url, env) {
  const backendUrl = env.BACKEND_URL || 'https://api.practice.energy';

  try {
    const backendRequestUrl = new URL(url.pathname + url.search, backendUrl);

    // Copy headers from original request, excluding Cloudflare-specific headers
    const headers = new Headers();
    for (const [key, value] of request.headers) {
      const lowerKey = key.toLowerCase();
      if (!['host', 'cf-connecting-ip', 'cf-ray', 'cf-ipcountry', 'cf-worker'].includes(lowerKey)) {
        headers.set(key, value);
      }
    }

    // Add origin header for backend
    headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
    headers.set('X-Forwarded-Host', request.headers.get('host') || '');

    const backendRequest = new Request(backendRequestUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ?
          await request.clone().arrayBuffer() : undefined,
    });

    const backendResponse = await fetch(backendRequest);

    // Return response with CORS headers
    const responseHeaders = new Headers(backendResponse.headers);
    Object.entries({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true'
    }).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Backend proxy error:', error);
    return new Response(JSON.stringify({
      error: 'Backend service unavailable',
      message: 'The backend service is currently unavailable',
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }
}