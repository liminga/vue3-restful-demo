import { defineConfig  } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
      port: 3000,
      proxy: {
        '/dev': {
          target: 'https://dev.178778.xyz',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev/, '')
        },
      }
    },
    build: {
      outDir: 'dist',
    },
})
