import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
      incrementalCache: 'cloudflare-kv',
      tagCache: 'cloudflare-kv',
      queue: 'sqs',
    },
  },
  middleware: {
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
    },
  },
};

export default config;