import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  experimental: {
    staticGeneration: {
      prerenderRoutes: ["/", "/dashboard", "/profile", "/calendar", "/saved", "/search"]
    }
  },
  override: {
    wrapper: "cloudflare-pages",
    converter: "edge",
    tagCache: "dummy",
    queue: "dummy",
    incrementalCache: "dummy",
    imageOptimization: "dummy"
  },
  // Cloudflare Pages specific settings
  cloudflare: {
    pages: {
      // Enable automatic static optimization
      static: true,
      // Enable edge functions
      functions: true,
      // Enable image optimization
      images: {
        domains: ['localhost', 'app.practice.energy', 'staging.practice.energy', 'preview.practice.energy']
      }
    }
  }
});