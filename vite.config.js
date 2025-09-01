import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}", "tests/**/*.{test,spec}.{js,ts}"],
    exclude: ["tests/e2e-playwright/**", "**/node_modules/**", "**/dist/**"],
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
    globals: true,
  },
});
