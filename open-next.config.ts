import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  experimental: {
    staticGeneration: {
      prerenderRoutes: ["/"]
    }
  },
  override: {
    wrapper: "cloudflare-pages",
    converter: "edge",
    tagCache: "dummy",
    queue: "dummy",
    incrementalCache: "dummy",
    imageOptimization: "dummy"
  }
});