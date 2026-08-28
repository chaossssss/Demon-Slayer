import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // GitHub Pages 项目站：https://<user>.github.io/Demon-Slayer/
  base: process.env.GITHUB_PAGES === 'true' ? '/Demon-Slayer/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 9630,
    strictPort: false,
  },
})
