import { expect, test } from "@playwright/test";
import { STUDENTS } from "./accounts";
import { signIn } from "./helpers";

// Runs in the "phone" project only (a Pixel 7's screen).

test("@phone the tab bar, the account menu, and no sideways scrolling", async ({ page }) => {
  await signIn(page, STUDENTS.hal);
  const tabs = page.locator(".tab-bar a");
  await expect(tabs).toHaveCount(5);
  await expect(tabs.first()).toHaveAttribute("aria-current", "page");

  for (const path of ["/", "/problems", "/problems/factorial", "/contests", "/leaderboard", "/awards", "/homework", "/syllabus"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${path} scrolls sideways`).toBeLessThanOrEqual(0);
  }

  await page.goto("/problems");
  await expect(page.locator(".tab-bar a", { hasText: "Practice" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Account" }).click();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});

test("@phone typing mode: the editor fills the screen, with Python keys above the keyboard", async ({ page }) => {
  await signIn(page, STUDENTS.hal);
  await page.goto("/problems/square-it");
  const editor = page.locator(".cm-content");
  const keys = page.getByRole("toolbar", { name: "Python keys" });
  await expect(keys).toHaveCount(0);

  await editor.tap();
  await expect(keys).toBeVisible();
  await keys.getByRole("button", { name: "Type #" }).tap();
  await expect(editor).toContainText("#");
  // The editor keeps the cursor, so a real keyboard would stay open.
  await expect(editor).toBeFocused();
  await keys.getByRole("button", { name: "Undo" }).tap();
  await expect(editor).not.toContainText("#");

  // Done, along the top, puts the keyboard away and lands back on the code,
  // even if the page had moved while typing.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Done", exact: true }).tap();
  await expect(keys).toHaveCount(0);
  await expect(editor).toBeInViewport();
  await expect(page.getByRole("button", { name: "Run examples" })).toBeVisible();

  // Run from typing mode runs the examples and shows the results.
  await editor.tap();
  await page.getByRole("button", { name: "Run", exact: true }).tap();
  await expect(keys).toHaveCount(0);
  await expect(page.locator("#panel-results")).toContainText("Failed", { timeout: 60_000 });
});
