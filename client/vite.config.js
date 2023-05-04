import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://chat-app-api-8r84.onrender.com",
    },
  },
  plugins: [react()],
})
