import { defineConfig, devices } from "@playwright/test";

// End-to-end tests: `npm run e2e`. They start their own copy of the site on
// port 3100 with its own database (prisma/e2e.db, rebuilt each run by
// e2e/prepare.ts) and build folder, so the dev server and its data are never
// touched. The first time, run `npx playwright install chromium`; or point
// PLAYWRIGHT_CHROMIUM at a Chromium you already have.

const PORT = 3100;
export const TEACHER = { username: "teacher", password: "e2e-teacher-pass" };

export default defineConfig({
  testDir: "e2e",
  // One shared database, so one test at a time.
  workers: 1,
  fullyParallel: false,
  timeout: 90_000,
  expect: { timeout: 20_000 },
  reporter: [["list"]],
  retries: 0,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 860 } }, grepInvert: /@phone/ },
    { name: "phone", use: { ...devices["Pixel 7"] }, grep: /@phone/ },
  ],
  webServer: {
    command: `npx tsx e2e/prepare.ts && npx next dev --port ${PORT}`,
    url: `http://localhost:${PORT}/login`,
    timeout: 240_000,
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
    env: {
      DATABASE_URL: "file:./e2e.db",
      NEXT_DIST_DIR: ".next-e2e",
      AUTH_SECRET: "e2e-only-secret-not-for-real-use-0123456789",
      AUTH_TRUST_HOST: "true",
      TEACHER_USERNAME: TEACHER.username,
      TEACHER_PASSWORD: TEACHER.password,
      TEACHER_NAME: "Ms Teacher",
      NEXT_PUBLIC_SITE_NAME: "Breakpoint",
    },
  },
});
