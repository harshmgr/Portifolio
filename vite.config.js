import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' makes the build work from any GitHub Pages path (user or project site)
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
  },
})
