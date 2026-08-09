
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Programmatically load environment variables from .env in Node 20+
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (e) {
    // Fallback if .env is missing
  }
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    react(),
    {
      name: 'teamgraph-api-middleware',
      async configureServer(server) {
        const { default: apiMiddleware } = await import('./server/api-middleware.ts');
        server.middlewares.use(apiMiddleware);
      },
      async configurePreviewServer(server) {
        const { default: apiMiddleware } = await import('./server/api-middleware.ts');
        server.middlewares.use(apiMiddleware);
      }
    }
  ]
});
