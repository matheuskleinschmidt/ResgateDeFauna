import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/*.controller.test.js", "**/node_modules/**"],
    setupFiles: "./setupTests.js",
    coverage: { exclude: ['database/**','**/route.js', '*.config.js','**/.next/**', '**/cypress/**', '**/*.controller.test.js','**/api/**', '**/public/**'] },
  },
});
