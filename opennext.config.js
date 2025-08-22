// opennext.config.js
/** @type {import('@opennextjs/cloudflare').Config} */
const config = {
    basePath: '/.open-next/assets',
    buildCommand: 'npm run build',
    output: 'standalone',
    // Другие настройки...
};

module.exports = config;