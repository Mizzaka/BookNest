import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from external hosts (e.g., Docker container)
    port: 3000,      // Run the development server on port 3000
  },
});
