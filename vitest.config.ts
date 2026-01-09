// filepath: vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tsconfigPaths(), // <--- AQUESTA és la clau màgica que soluciona el teu error
    react(),
  ],
  test: {
    environment: 'jsdom', // Necessari per testejar components de React més endavant
    globals: true,
    setupFiles: [], // Aquí posarem setups globals si cal
  },
});