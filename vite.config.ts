import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { nitro } from 'nitro/vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    watch: {
      // Don't watch build output — avoids Windows EBUSY watcher crashes
      // when a production build writes here while the dev server runs.
      ignored: ['**/.vercel/**', '**/dist/**', '**/.output/**', '**/.nitro/**'],
    },
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), nitro({ preset: 'vercel' }), viteReact()],
})

export default config
