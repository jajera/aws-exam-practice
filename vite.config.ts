import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'data/*.json',
          dest: 'data'
        }
      ]
    })
  ],
  base: '/aws-exam-practice/',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  publicDir: 'public'
})
