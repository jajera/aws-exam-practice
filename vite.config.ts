import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/aws-exam-practice/',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  publicDir: 'public'
})
