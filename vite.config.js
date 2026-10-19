import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// In dev the React app (5173) proxies API + uploaded files to the Express server (4000), so cookies stay same-origin.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:4000', '/uploads': 'http://localhost:4000' } },
})
