import { defineConfig, devices } from "@playwright/test";

// The local Vite server is started automatically. A remote URL is tested as-is.
const localURL = "http://127.0.0.1:5173";
const baseURL = process.env.E2E_BASE_URL || localURL;
const runLocalServer = [localURL, "http://localhost:5173"].includes(baseURL.replace(/\/$/, ""));

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  outputDir: "test-results",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: runLocalServer
    ? {
        command: "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",
        url: localURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
