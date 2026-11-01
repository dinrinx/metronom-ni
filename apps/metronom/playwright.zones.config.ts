import { defineConfig, devices } from "@playwright/test";

// Прогон сквозного сценария через обе зоны: Метроном на :3000, НИ на :3001 (за rewrites на /ni).
export default defineConfig({
  testDir: "./tests/zones",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
      port: 3000,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm --prefix ../narodnye-investicii run dev -- --port 3001",
      port: 3001,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], channel: "chrome" } }],
});
