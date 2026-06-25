import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // Split heavy vendors into separate, cacheable chunks that download in
    // parallel instead of one large bundle. Keeps initial parse work smaller.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          framer: ['framer-motion'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
})
