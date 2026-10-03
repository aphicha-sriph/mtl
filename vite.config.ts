import { existsSync } from 'node:fs'
import { extname, resolve } from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  base: '/mtl/',
  build: {
    rollupOptions: isSsrBuild ? {} : {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          catalog: ['./src/data/catalog.ts'],
          articles: ['./src/data/articles.ts'],
          'product-details': ['./src/data/productDetails.ts'],
        },
      },
    },
  },
  plugins: [
    react(),
    {
      name: 'serve-prerendered-clean-urls',
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          if (request.method === 'GET' && request.url) {
            const url = new URL(request.url, 'http://localhost')
            const route = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '')
            const routeIndex = resolve('dist', route, 'index.html')

            if (route && !extname(route) && existsSync(routeIndex)) {
              request.url = `/${route}/index.html${url.search}`
            }
          }
          next()
        })
      },
    },
  ],
}))
