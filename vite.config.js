import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Render static CDN intermittently 404'd extracted CSS while JS served fine.
    // Inject styles via JS so production never depends on a separate .css asset.
    cssInjectedByJsPlugin({ topExecutionPriority: true }),
  ],
  build: {
    cssCodeSplit: false,
  },
})
