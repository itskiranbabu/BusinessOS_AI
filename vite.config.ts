import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite automatically exposes variables prefixed with VITE_ to import.meta.env
  // We add NEXT_PUBLIC_ prefix support for compatibility
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
});
