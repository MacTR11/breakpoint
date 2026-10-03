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
