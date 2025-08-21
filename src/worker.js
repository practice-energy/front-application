import { getAssetFromKV, mapRequestToAsset } from "@cloudflare/kv-asset-handler"

// Define a basic asset manifest for static content
const assetManifest = {
  // This will be populated by the build process
  // For now, we'll use an empty object to avoid the import error
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    try {
      // Handle API routes
      if (url.pathname.startsWith("/api/")) {
        return handleApiRoute(request, env, ctx)
      }

      // Handle static assets and pages
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
          mapRequestToAsset: mapRequestToAsset,
          cacheControl: {
            browserTTL: 60 * 60 * 24 * 30, // 30 days
            edgeTTL: 60 * 60 * 24 * 30, // 30 days
          },
        },
      )
    } catch (e) {
      // Fallback to index.html for client-side routing
      try {
        const notFoundResponse = await getAssetFromKV(
          {
            request: new Request(`${url.origin}/index.html`, request),
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          },
        )

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 200,
        })
      } catch (e) {
        return new Response("Not found", { status: 404 })
      }
    }
  },
}

async function handleApiRoute(request, env, ctx) {
  const url = new URL(request.url)

  // Example API route handling
  if (url.pathname === "/api/health") {
    return new Response(JSON.stringify({ status: "ok", timestamp: Date.now() }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  // Handle authentication endpoints
  if (url.pathname.startsWith("/api/auth/")) {
    return handleAuthRoute(request, env, ctx)
  }

  // Handle chat endpoints
  if (url.pathname.startsWith("/api/chat/")) {
    return handleChatRoute(request, env, ctx)
  }

  return new Response("API endpoint not found", { status: 404 })
}

async function handleAuthRoute(request, env, ctx) {
  const url = new URL(request.url)

  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    const body = await request.json()

    // Implement your authentication logic here
    // Use env.SESSIONS KV namespace to store session data

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response("Auth endpoint not found", { status: 404 })
}

async function handleChatRoute(request, env, ctx) {
  const url = new URL(request.url)

  if (url.pathname === "/api/chat/messages" && request.method === "GET") {
    // Implement chat message retrieval
    // Use env.DB D1 database to store and retrieve messages

    return new Response(JSON.stringify({ messages: [] }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  if (url.pathname === "/api/chat/send" && request.method === "POST") {
    const body = await request.json()

    // Implement message sending logic
    // Store in env.DB D1 database

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response("Chat endpoint not found", { status: 404 })
}
