import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@radix-ui')) return 'vendor-radix'
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts'
            if (id.includes('@dnd-kit')) return 'vendor-dnd'
            if (id.includes('@tanstack')) return 'vendor-tanstack'
            if (id.includes('lucide-react')) return 'vendor-icons'
            if (id.includes('motion') || id.includes('framer')) return 'vendor-motion'
            if (id.includes('date-fns') || id.includes('react-day-picker')) return 'vendor-date'
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) return 'vendor-forms'
            if (id.includes('cmdk') || id.includes('vaul') || id.includes('sonner') || id.includes('input-otp') || id.includes('react-dropzone') || id.includes('react-resizable-panels')) return 'vendor-overlays'
            return 'vendor'
          }
        },
      },
    },
  },
})
