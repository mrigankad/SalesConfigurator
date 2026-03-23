import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // PDF renderer — lazy-loaded, keep completely isolated
          if (id.includes('@react-pdf')) return 'vendor-pdf';

          // Three.js ecosystem — large, split from app code
          if (id.includes('@react-three') || id.includes('three/')) return 'vendor-r3f';
          if (id.includes('node_modules/three')) return 'vendor-three';

          // Animation + Radix UI
          if (id.includes('framer-motion') || id.includes('@radix-ui')) return 'vendor-ui';

          // State
          if (id.includes('zustand')) return 'vendor-state';

          // React core
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor-react';
        },
      },
    },
  },
})
