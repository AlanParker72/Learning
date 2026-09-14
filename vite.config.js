import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        // Web-component / host embed entry — import this bundle and use <delivery-dashboard>.
        embed: path.resolve(__dirname, 'src/embed/deliveryDashboardElement.ts')
      }
    }
  }
})
