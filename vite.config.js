import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Remove axios from external array to include it in the build
      external: [],
      sourcemap: true,
    },
  },
});
