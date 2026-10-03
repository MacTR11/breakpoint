import { expect, test } from "@playwright/test";
import { STUDENTS } from "./accounts";
import { signIn } from "./helpers";

test("the boxes on Home open what they show, and an award is ringed on arrival", async ({ page }) => {
  await signIn(page, STUDENTS.gus);

  // An award on Home opens that award on the Awards page, ringed so it can be found.
  const awards = page.locator("section", { has: page.getByRole("heading", { name: "Awards" }) });
  const first = awards.locator("a.box-link").first();
  const href = await first.getAttribute("href");
  expect(href).toMatch(/^\/awards#[a-z-]+$/);
  await first.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator(`[id="${href!.split("#")[1]}"]`)).toHaveAttribute("data-arrived", "");

  // On the Awards page, an award leads to where it is earned.
  await page.locator('[id="first-fix"] a').click();
  await expect(page).toHaveURL(/\/problems\?type=fix$/);

  // The figures on Home open their pages.
  await page.goto("/");
  await page.getByRole("link", { name: /^Solved/ }).click();
  await expect(page).toHaveURL(/\/syllabus$/);
});
