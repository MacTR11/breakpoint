import { expect, test } from "@playwright/test";
import { STUDENTS } from "./accounts";
import { signIn } from "./helpers";

test("a mock paper runs against the clock with hints off, and can be handed in", async ({ page }) => {
  await signIn(page, STUDENTS.gus);
  await page.goto("/mock");
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: /^Start:/ }).click();
  await expect(page.getByRole("heading", { name: "Mock paper" })).toBeVisible();

  await page.locator('main a[href^="/problems/"]').first().click();
  await expect(page).toHaveURL(/\/problems\//);
  await expect(page.getByText("Hints are off during a mock paper.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Use a hint/ })).toHaveCount(0);

  await page.getByRole("link", { name: "Back to the paper" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Hand in now" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/of \d+ marks/);
});
