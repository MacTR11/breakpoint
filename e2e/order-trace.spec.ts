import { expect, test, type Page } from "@playwright/test";
import { STUDENTS, TEACHER } from "./accounts";
import { contains, everythingSent, problem, signIn } from "./helpers";

/** The lines of the program being put together, as the page shows them. */
const programLines = (page: Page) => page.getByRole("list", { name: "Your program" }).locator("pre").allTextContents();

test("put in order: drag and move the lines, leave out the spare one, and submit", async ({ page }) => {
  const p = problem("order-factorial");
  const wanted = p.solution!.split("\n").filter((line) => line.trim()).map((line) => line.trim());
  await signIn(page, STUDENTS.jo);
  await page.goto(`/problems/${p.slug}`);

  // Drag the def line to the top by its handle.
  const rows = page.getByRole("list", { name: "Your program" }).locator("li");
  const from = (await programLines(page)).findIndex((line) => line.startsWith("def "));
  const handle = rows.nth(from).getByRole("button", { name: "Drag to move" }).boundingBox();
  const top = await rows.first().boundingBox();
  const box = (await handle)!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, top!.y + 4, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await programLines(page))[0]).toBe(wanted[0]);

  // The spare line does not belong.
  const spare = (await programLines(page)).find((line) => !wanted.includes(line))!;
  await page.getByRole("button", { name: `Leave out: ${spare}`, exact: true }).click();
  await expect(page.getByRole("list", { name: "Lines left out" })).toContainText(spare);

  // The rest with the arrow buttons.
  for (const [index, line] of wanted.entries()) {
    const at = (await programLines(page)).indexOf(line);
    for (let step = at; step > index; step--) await page.getByRole("button", { name: `Move up: ${line}`, exact: true }).click();
  }
  expect(await programLines(page)).toEqual(wanted);

  // The arrangement is kept when the page is opened again.
  await page.reload();
  await expect.poll(() => programLines(page)).toEqual(wanted);

  await page.getByRole("button", { name: "Submit" }).click();
  const solved = page.locator("dialog.solved-dialog");
  await expect(solved).toBeVisible({ timeout: 60_000 });
  await expect(solved).toContainText(`You solved ${p.title}`);
});

test("a trace table: wrong boxes are marked without the answer, and a fixed table earns half", async ({ page }) => {
  const p = problem("trace-average");
  const answer = p.answer as string[][];
  await signIn(page, STUDENTS.jo);

  // Nothing of the answer reaches the browser before it is finished.
  const sent = await everythingSent(page, `/problems/${p.slug}`);
  expect(contains(sent, p.title)).toBe(true);
  expect(contains(sent, p.explanation!.trim().slice(0, 40))).toBe(false);
  expect(contains(sent, JSON.stringify(answer.at(-1)))).toBe(false);

  await page.goto(`/problems/${p.slug}`);
  // The first row is given; every other box is filled in, with one mistake.
  const boxes = page.locator(".trace-input");
  const blanks = answer.slice(1).flat();
  await expect(boxes).toHaveCount(blanks.length);
  for (const [index, value] of blanks.entries()) await boxes.nth(index).fill(index === 5 ? "12" : value);
  await page.getByRole("button", { name: "Check table" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "wrong" })).toContainText("1 box was wrong");
  await expect(page.locator("td.trace-wrong")).toHaveCount(1);

  await boxes.nth(5).fill(blanks[5]);
  await page.getByRole("button", { name: "Check table" }).click();
  const solved = page.locator("dialog.solved-dialog");
  await expect(solved).toBeVisible();
  await expect(solved).toContainText("2 tries");
  await solved.getByRole("button", { name: "Stay on this page" }).click();
  await expect(page.getByText("(second attempt)")).toBeVisible();
});

test("the teacher sees a student's trace table marked, and cannot break the new kinds with the edit form", async ({ page }) => {
  await signIn(page, TEACHER);
  await page.goto("/teacher");
  await page.getByRole("link", { name: STUDENTS.jo.name }).first().click();
  const attempt = page.locator("details", { hasText: problem("trace-average").title }).filter({ hasText: "Failed" });
  await expect(attempt).toContainText("19/20 boxes");
  await attempt.locator("summary").click();
  await expect(attempt.locator("td.trace-wrong").first()).toBeVisible();

  await page.goto("/teacher/problems");
  await page.getByRole("row", { name: problem("order-total").title }).getByRole("link", { name: "Edit" }).click();
  await expect(page.getByText("challenges cannot be edited here")).toBeVisible();
});
