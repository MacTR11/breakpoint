import { expect, test } from "@playwright/test";
import { STUDENTS, TEACHER } from "./accounts";
import { pasteFromOutside, problem, setPasteMode, signIn } from "./helpers";

// A large paste is noted for the teacher as a reason for a conversation, never shown to the student.
const padded = (code: string) => `${code.trimEnd()}\n# ${"copied from somewhere else ".repeat(6)}\n`;

test("a large paste is recorded for the teacher, and blocked when the teacher says so", async ({ browser }) => {
  const teacher = await (await browser.newContext()).newPage();
  await signIn(teacher, TEACHER);
  const eve = await (await browser.newContext()).newPage();
  await signIn(eve, STUDENTS.eve);

  try {
    await eve.goto("/problems/count-vowels");
    await eve.locator(".cm-content").click();
    await eve.keyboard.press("ControlOrMeta+A");
    await eve.keyboard.press("Delete");
    await pasteFromOutside(eve, padded(problem("count-vowels").solution!));
    await expect(eve.locator(".cm-content")).toContainText("copied from somewhere else");
    await eve.getByRole("button", { name: "Submit" }).click();
    await expect(eve.locator("#panel-results")).toContainText(/All \d+ tests passed/, { timeout: 60_000 });
    // Nothing about it for the student.
    await expect(eve.getByText(/paste flag|Large paste/i)).toHaveCount(0);

    await teacher.goto("/teacher");
    await teacher.getByRole("link", { name: STUDENTS.eve.name }).click();
    await expect(teacher.getByText("Large paste").first()).toBeVisible();

    await setPasteMode(teacher, "block");
    await eve.goto("/problems/say-hello");
    await pasteFromOutside(eve, padded(problem("say-hello").solution!));
    await expect(eve.getByText("Pasting large blocks of code from outside the editor is switched off")).toBeVisible();
    await expect(eve.locator(".cm-content")).not.toContainText("copied from somewhere else");
    // A short paste is still allowed.
    await pasteFromOutside(eve, "# a note");
    await expect(eve.locator(".cm-content")).toContainText("# a note");
  } finally {
    await setPasteMode(teacher, "record");
  }
});
