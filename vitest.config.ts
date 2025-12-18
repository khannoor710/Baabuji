import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // @ts-expect-error - Vite plugin version mismatch between vitest and @vitejs/plugin-react
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './__tests__/setup.ts',
    // Include test file patterns explicitly
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    // Exclude e2e tests from vitest (those are for Playwright)
    exclude: ['**/node_modules/**', '**/__tests__/e2e/**', '**/dist/**', '**/build/**'],
    // Use default reporter for better CI/CD compatibility
    reporters: process.env.CI ? ['verbose', 'json', 'html'] : ['verbose'],
    // Timeout settings
    testTimeout: 10000,
    hookTimeout: 10000,
    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        '__tests__/**',
        '**/*.config.ts',
        '**/*.config.js',
        '**/dist/**',
        '**/build/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
