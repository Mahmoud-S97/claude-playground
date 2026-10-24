import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Same-origin API calls in dev, so the httpOnly auth cookie is sent
    // without any CORS/credentials setup.
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
})
