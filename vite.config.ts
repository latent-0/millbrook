import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { nitro } from 'nitro/vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const h = (rel: string) => fileURLToPath(new URL(rel, import.meta.url))

// Blog publishing REST API (BLOG_API_CONTRACT.md). Registered as explicit Nitro
// handlers so they join Nitro's router ahead of the TanStack SSR catch-all.
// File-based scanning of ./api is shadowed by the catch-all in this Start
// integration, so we wire each route + method by hand.
const blogApiHandlers = [
  { route: '/api/v1/blogs', method: 'get', handler: h('./api/v1/blogs.get.ts') },
  { route: '/api/v1/blog/upload', method: 'post', handler: h('./api/v1/blog/upload.post.ts') },
  { route: '/api/v1/blog/:id', method: 'get', handler: h('./api/v1/blog/[id].get.ts') },
  { route: '/api/v1/blog/:id', method: 'patch', handler: h('./api/v1/blog/[id].patch.ts') },
  { route: '/api/v1/blog/:id', method: 'put', handler: h('./api/v1/blog/[id].put.ts') },
  { route: '/api/v1/blog/:id', method: 'delete', handler: h('./api/v1/blog/[id].delete.ts') },
  { route: '/api/v1/blog/:id/author', method: 'patch', handler: h('./api/v1/blog/[id]/author.patch.ts') },
  { route: '/api/v1/blog/:id/status', method: 'post', handler: h('./api/v1/blog/[id]/status.post.ts') },
  { route: '/blog-sitemap.xml', method: 'get', handler: h('./api/blog-sitemap.get.ts') },
]

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    watch: {
      // Don't watch build output — avoids Windows EBUSY watcher crashes
      // when a production build writes here while the dev server runs.
      ignored: ['**/.vercel/**', '**/dist/**', '**/.output/**', '**/.nitro/**'],
    },
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: 'vercel', handlers: blogApiHandlers }),
    viteReact(),
  ],
})

export default config
