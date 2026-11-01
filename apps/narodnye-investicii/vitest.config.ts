import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@m": path.resolve(__dirname, "src/metronom"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
