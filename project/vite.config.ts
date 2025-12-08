import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Development server configuration
  server: {
    proxy: {
      '/api': {
        target: 'https://smart-surplus-food-redistribution.onrender.com', // FastAPI backend
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
