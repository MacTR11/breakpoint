import { expect, test } from "@playwright/test";
import { STUDENTS, TEACHER } from "./accounts";
import { signIn } from "./helpers";

test("a student finds a challenge with Ctrl K and opens it with Enter", async ({ page }) => {
  await signIn(page, STUDENTS.fay);
  await page.waitForLoadState("networkidle");
  await page.keyboard.press("ControlOrMeta+k");
  const search = page.getByRole("combobox", { name: /Search for/ });
  await expect(search).toBeFocused();
  await search.fill("binary search");
  await expect(page.getByRole("option").first()).toContainText("Binary Search");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/problems\/binary-search$/);
});

test("the teacher finds a student by name", async ({ page }) => {
  await signIn(page, TEACHER);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("combobox", { name: /Search for/ }).fill("ann arch");
  await expect(page.getByRole("option").first()).toContainText(STUDENTS.ann.name);
  await page.getByRole("option").first().click();
  await expect(page).toHaveURL(/\/teacher\/students\/\w+/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(STUDENTS.ann.name);
});
