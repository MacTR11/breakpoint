import { expect, test } from "@playwright/test";
import { STUDENTS } from "./accounts";
import { signIn } from "./helpers";

test("the weekly class race is on Home, with the student's class in it", async ({ page }) => {
  await signIn(page, STUDENTS.gus);
  const race = page.getByRole("region", { name: "This week's class race" });
  await expect(race).toBeVisible();
  await expect(race).toContainText("Class race this week");
  // Every class with students is in the race, including the student's own.
  for (const group of ["12A", "12B", "13A"]) await expect(race).toContainText(group);
  await expect(race.getByText("ends in")).toBeVisible();
  await page.screenshot({ path: "test-results/race-home.png", fullPage: false });

  await race.getByRole("link", { name: "Full table" }).click();
  await expect(page).toHaveURL(/view=classes&period=week/);
  await expect(page.getByRole("link", { name: "This week" })).toHaveAttribute("aria-current", "true");
});
