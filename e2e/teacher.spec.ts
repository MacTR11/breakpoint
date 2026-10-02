import { expect, test } from "@playwright/test";
import { TEACHER } from "./accounts";
import { signIn } from "./helpers";

test("adding a student shows their password once, and it works", async ({ page, browser }) => {
  await signIn(page, TEACHER);
  await page.goto("/teacher/students/new");
  await page.getByLabel("Name", { exact: true }).fill("Zoe Zed");
  await page.locator('select[name="group"]').selectOption({ label: "13A" });
  await page.getByRole("button", { name: "Add student" }).click();
  const row = page.getByRole("row", { name: /Zoe Zed/ });
  await expect(row).toContainText("zzed");
  const password = (await row.locator("td").last().innerText()).trim();
  expect(password.length).toBeGreaterThanOrEqual(8);

  const zoe = await (await browser.newContext()).newPage();
  await signIn(zoe, { username: "zzed", password });
  await expect(zoe.getByRole("heading", { level: 1 })).toContainText("Zoe");

  // The password cannot be read back afterwards.
  await page.reload();
  await expect(page.getByText(password)).toHaveCount(0);
});

test("adding a class", async ({ page }) => {
  await signIn(page, TEACHER);
  await page.goto("/teacher/classes");
  await page.getByLabel("Name", { exact: true }).fill("12C");
  await page.getByRole("button", { name: "Add class" }).click();
  await expect(page.getByRole("status")).toContainText("Added");
  await expect(page.getByRole("link", { name: /12C/ }).first()).toBeVisible();
});

test("a form keeps what was typed when the teacher's sign-in ends while it is open", async ({ page, context }) => {
  await signIn(page, TEACHER);
  await page.goto("/teacher/classes");
  await page.getByLabel("Name", { exact: true }).fill("Kept 12Z");

  // Signed out everywhere from another tab.
  const other = await context.newPage();
  await other.goto("/teacher/settings");
  await other.getByRole("button", { name: "Sign out everywhere" }).click();
  await expect(other).toHaveURL(/\/login/);

  await page.getByRole("button", { name: "Add class" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Your sign-in has ended" })).toBeVisible();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Kept 12Z");
});
