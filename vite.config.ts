import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    nodePolyfills()
  ],
  resolve: {
    alias: {
      events: 'events',
    },
  },
  optimizeDeps: {
    exclude: ["bittorrent-dht", "load-ip-set"], // Exclude Node.js-only modules
  },
  build: {
    rollupOptions: {
      external: ["bittorrent-dht", "load-ip-set"], // Ensure they're not bundled
    },
  },
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
  },

})
