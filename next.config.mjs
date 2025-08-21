/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizations for Cloudflare Workers
  trailingSlash: false,
  images: {
    unoptimized: true,
    domains: ['localhost', 'app.practice.energy', 'staging.practice.energy', 'preview.practice.energy'],
  },
  
  // Build optimizations
  compress: true,
  poweredByHeader: false,
  
  // TypeScript and ESLint settings
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Webpack configuration for Cloudflare Workers
  webpack: (config, { dev, isServer }) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    
    // Handle Node.js modules that might not work in Workers
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      util: false,
      buffer: false,
      process: false,
    }
    
    return config
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_GRAPHQL_HTTP_URL: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL,
    NEXT_PUBLIC_GRAPHQL_WS_URL: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL,
  },
  
  // Headers for security (only for server-side rendering)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/(.*).css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Redirects (if needed)
  async redirects() {
    return [
      // Add any redirects here
    ]
  },
  
  // Rewrites (if needed)
  async rewrites() {
    return [
      // Add any rewrites here
    ]
  },
}

export default nextConfig
