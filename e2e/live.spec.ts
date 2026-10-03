import { expect, test } from "@playwright/test";
import { STUDENTS, TEACHER } from "./accounts";
import { problem, signIn } from "./helpers";

test("a live lesson opens on the student's screen, and the teacher watches it get solved", async ({ browser }) => {
  const p = problem("mystery-function");
  const teacher = await (await browser.newContext()).newPage();
  const student = await (await browser.newContext()).newPage();

  await signIn(teacher, TEACHER);
  await teacher.goto("/teacher/live");
  await teacher.locator(`select[name="classId"]`).selectOption({ label: "13C" });
  const value = await teacher.locator('select[name="problemId"] option', { hasText: p.title }).first().getAttribute("value");
  await teacher.locator(`select[name="problemId"]`).selectOption(value!);
  await teacher.getByRole("button", { name: "Start the lesson" }).click();
  const tile = teacher.getByRole("list", { name: "Students" }).getByRole("listitem").filter({ hasText: STUDENTS.kit.name });
  await expect(tile).toContainText("Not opened yet");

  try {
    // Signing in, the student is taken straight to the lesson's challenge.
    await signIn(student, STUDENTS.kit);
    await expect(student).toHaveURL(new RegExp(`/problems/${p.slug}$`));
    await expect(student.getByText("This is the class challenge for now")).toBeVisible();
    await teacher.reload();
    await expect(tile).toContainText("Opened");

    await student.getByRole("radio").nth(p.answer as number).click();
    await student.getByRole("button", { name: "Check answer" }).click();
    await expect(student.locator("dialog.solved-dialog")).toBeVisible();
    await teacher.reload();
    await expect(tile).toContainText("Solved in");

    // Elsewhere on the site, a strip leads back to it.
    await student.goto("/problems");
    await expect(student.getByRole("status").filter({ hasText: p.title }).getByRole("link", { name: "Open it" })).toBeVisible();
  } finally {
    await teacher.goto("/teacher/live");
    await teacher.getByRole("button", { name: "End the lesson" }).click();
  }
  await expect(teacher.getByRole("button", { name: "Start the lesson" })).toBeVisible();
  await student.reload();
  await expect(student.getByText("for the class now")).toHaveCount(0);
});
