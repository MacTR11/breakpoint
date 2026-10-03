import { expect, test } from "@playwright/test";
import { STUDENTS, TEACHER } from "./accounts";
import { problem, signIn, typeCode } from "./helpers";

const inAWeek = () => {
  const date = new Date(Date.now() + 7 * 86_400_000);
  return `${date.toISOString().slice(0, 10)}T08:30`;
};

test("the teacher sets homework; the class sees it, rings the bell, and ticks it off", async ({ browser }) => {
  const teacher = await (await browser.newContext()).newPage();
  await signIn(teacher, TEACHER);
  await teacher.goto("/teacher/homework/new");
  await teacher.getByLabel("Title").fill("E2E doubling");
  await teacher.locator('select[name="classId"]').selectOption({ label: "12A" });
  await teacher.getByLabel("Due (UK time)").fill(inAWeek());
  await teacher.getByLabel("Search challenges").fill("Double it");
  await teacher.getByRole("checkbox", { name: /Double it/ }).check();
  await teacher.getByRole("button", { name: "Set homework" }).click();
  await expect(teacher).toHaveURL(/\/teacher\/homework\/\w+/);
  await expect(teacher.getByRole("heading", { name: "E2E doubling" })).toBeVisible();

  // Dan is in 12A.
  const dan = await (await browser.newContext()).newPage();
  await signIn(dan, STUDENTS.dan);
  await expect(dan.getByText("E2E doubling")).toBeVisible();
  const bell = dan.getByRole("button", { name: /Notifications/ });
  await expect(bell).toHaveAccessibleName(/new/);
  await bell.click();
  await expect(dan.getByRole("dialog", { name: "Notifications" })).toContainText("Homework: E2E doubling");
  await dan.reload();
  await expect(dan.getByRole("button", { name: /Notifications/ })).toHaveAccessibleName("Notifications");

  await dan.goto("/problems/double-it");
  await typeCode(dan, problem("double-it").solution!);
  await dan.getByRole("button", { name: "Submit" }).click();
  await expect(dan.locator("#panel-results")).toContainText(/All \d+ tests passed/, { timeout: 60_000 });
  await dan.goto("/homework");
  const set = dan.locator("div", { has: dan.getByText("E2E doubling", { exact: true }) }).first();
  await expect(set).toContainText("Done");

  // Cat is in 12B, so it is not hers.
  const cat = await (await browser.newContext()).newPage();
  await signIn(cat, STUDENTS.cat);
  await cat.goto("/homework");
  await expect(cat.getByText("E2E doubling")).toHaveCount(0);

  await teacher.reload();
  await expect(teacher.getByRole("row", { name: new RegExp(STUDENTS.dan.name) })).toContainText("Done");
});
