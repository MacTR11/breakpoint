import { expect, test } from "@playwright/test";
import { STUDENTS } from "./accounts";
import { problem, signIn, typeCode } from "./helpers";

test("write a function: try the examples, submit it, and get an award sticker", async ({ page }) => {
  await signIn(page, STUDENTS.ben);
  await page.goto("/problems/say-hello");
  const results = page.locator("#panel-results");
  await page.getByRole("button", { name: "Run examples" }).click();
  // The first run downloads Python into the browser, so it can take a while.
  await expect(results).toContainText("✗ Failed", { timeout: 60_000 });

  await typeCode(page, problem("say-hello").solution!);
  await page.getByRole("button", { name: "Run examples" }).click();
  await expect(results).toContainText("examples passed");

  await page.getByRole("button", { name: "Submit" }).click();
  await expect(results).toContainText(/All \d+ tests passed/, { timeout: 60_000 });
  await expect(results).toContainText("+5 points");
  await expect(page.locator(".award-sticker", { hasText: "First pass" })).toBeVisible();

  await page.reload();
  await expect(page.getByText("Compare with a model answer")).toBeVisible();
});

test("a failed example shows what was expected and what came back", async ({ page }) => {
  await signIn(page, STUDENTS.ben);
  await page.goto("/problems/count-vowels");
  await typeCode(page, "def count_vowels(text):\n    return len(text)");
  await page.getByRole("button", { name: "Run examples" }).click();
  const results = page.locator("#panel-results");
  await expect(results).toContainText("expected", { timeout: 60_000 });
  await expect(results).toContainText("returned");
});

test("fix the bug: once solved, the fix is shown line by line", async ({ page }) => {
  await signIn(page, STUDENTS.ben);
  await page.goto("/problems/fix-total");
  await expect(page.getByText("this code has bugs")).toBeVisible();
  await typeCode(page, problem("fix-total").solution!);
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.locator("#panel-results")).toContainText(/All \d+ tests passed/, { timeout: 60_000 });

  await page.reload();
  await expect(page.getByRole("heading", { name: "Your fix" })).toBeVisible();
  await expect(page.locator('.diff-line[data-kind="added"]').first()).toBeVisible();
  await expect(page.locator('.diff-line[data-kind="removed"]').first()).toBeVisible();
});

test("a puzzle: a wrong answer costs points, a right second answer earns half", async ({ page }) => {
  const p = problem("mystery-function");
  await signIn(page, STUDENTS.ben);
  await page.goto(`/problems/${p.slug}`);
  const wrong = p.answer === 0 ? 1 : 0;
  await page.getByRole("radio").nth(wrong).click();
  await page.getByRole("button", { name: "Check answer" }).click();
  const verdict = page.getByRole("alert").filter({ hasText: "Not right." });
  await expect(verdict).toContainText("1 attempt left");

  await page.getByRole("radio").nth(p.answer!).click();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(page.getByText("Correct.")).toBeVisible();
  await expect(page.getByText("(second attempt)")).toBeVisible();
});
