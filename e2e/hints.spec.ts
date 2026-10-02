import { expect, test } from "@playwright/test";
import { STUDENTS } from "./accounts";
import { problem, signIn } from "./helpers";

test("a hint costs a token and is revealed in order", async ({ page }) => {
  const p = problem("factorial");
  await signIn(page, STUDENTS.cat);
  await page.goto(`/problems/${p.slug}`);
  const tokens = page.locator(".stat-chip", { hasText: "hint" });
  await expect(tokens).toContainText("3 hints");
  await expect(page.getByText(p.hints[0].slice(0, 30))).toHaveCount(0);

  await page.getByRole("button", { name: "Use a hint" }).click();
  await expect(page.getByText(p.hints[0].slice(0, 30))).toBeVisible();
  await expect(page.getByText(p.hints[1].slice(0, 30))).toHaveCount(0);
  await expect(tokens).toContainText("2 hints");

  // Still there, and still paid for, after a reload.
  await page.reload();
  await expect(page.getByText(p.hints[0].slice(0, 30))).toBeVisible();
  await expect(tokens).toContainText("2 hints");
});
