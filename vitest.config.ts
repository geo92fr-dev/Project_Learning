/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['src/routes/**/*.test.{js,ts}'], // Éviter les conflits avec les routes SvelteKit
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**/*.{js,ts}'],
      exclude: [
        'src/lib/**/*.d.ts',
        'src/lib/**/*.test.{js,ts}',
        'src/lib/**/*.spec.{js,ts}'
      ]
    },
    // Configuration pour les tests TDD selon DOC_CoPilot_Practices
    watchExclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 5000,
    hookTimeout: 5000
  }
});
