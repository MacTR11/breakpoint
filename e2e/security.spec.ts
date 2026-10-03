import { expect, test } from "@playwright/test";
import { STUDENTS } from "./accounts";
import { contains, everythingSent, problem, signIn } from "./helpers";

// Expected answers, hidden tests, model answers and hints not yet paid for must never reach the browser.

test("a challenge page sends no hidden tests, model answer or unpaid hints", async ({ page }) => {
  await signIn(page, STUDENTS.ann);
  for (const slug of ["factorial", "say-hello", "fix-total", "count-vowels"]) {
    const p = problem(slug);
    const sent = await everythingSent(page, `/problems/${slug}`);
    expect(contains(sent, p.title), `${slug} page loads`).toBe(true);
    for (const hidden of p.tests!.filter((t) => t.hidden)) {
      const value = typeof hidden.expected === "string" ? hidden.expected : JSON.stringify(hidden.expected);
      // Short values (0, 1, true) appear on any page; distinctive ones must not.
      if (value.length >= 5) expect(contains(sent, value), `${slug}: hidden expected value ${value}`).toBe(false);
    }
    // The most distinctive line of the model answer: one not in the starter code or the question.
    const secret = p
      .solution!.split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length >= 12 && !p.starter?.includes(line) && !p.description.includes(line))
      .sort((a, b) => b.length - a.length)[0];
    if (secret) expect(contains(sent, secret), `${slug}: model answer line "${secret}"`).toBe(false);
    for (const hint of p.hints) expect(contains(sent, hint.slice(0, 40)), `${slug}: hint "${hint.slice(0, 40)}"`).toBe(false);
  }
});

test("a puzzle's answer and explanation are not sent before it is answered", async ({ page }) => {
  await signIn(page, STUDENTS.ann);
  const p = problem("mystery-function");
  const sent = await everythingSent(page, `/problems/${p.slug}`);
  expect(contains(sent, p.title)).toBe(true);
  expect(contains(sent, p.explanation!.slice(0, 40))).toBe(false);
});

test("the search list holds only what a student can open", async ({ page }) => {
  await signIn(page, STUDENTS.ann);
  const { items } = (await (await page.request.get("/api/palette")).json()) as { items: { title: string; href: string; group: string }[] };
  const titles = new Set(items.map((i) => i.title));
  expect(titles.has(problem("factorial").title)).toBe(true);
  // In the "bug-hunt" pack, which has not been scheduled.
  expect(titles.has(problem("fix-vowels").title)).toBe(false);
  expect(items.some((i) => i.group === "Students" || i.group === "Classes" || i.group === "Homework")).toBe(false);
  // And a held challenge cannot be opened directly.
  expect((await page.request.get("/problems/fix-vowels")).status()).toBe(404);
});

test("only the teacher can download a backup; the health check says nothing else", async ({ page }) => {
  expect((await page.request.get("/teacher/backup")).status()).toBe(403);
  await signIn(page, STUDENTS.ann);
  expect((await page.request.get("/teacher/backup")).status()).toBe(403);
  const health = await page.request.get("/api/health");
  expect(health.status()).toBe(200);
  expect(await health.json()).toEqual({ ok: true });
});
