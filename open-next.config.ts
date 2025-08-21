import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Ensure CSS files are properly handled
  experimental: {
    css: true,
  },
  // Custom asset handling
  assets: {
    include: ['**/*.css', '**/*.scss', '**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.ico'],
  },
});