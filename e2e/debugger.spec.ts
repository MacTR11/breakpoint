import { expect, test } from "@playwright/test";
import { STUDENTS } from "./accounts";
import { signIn, typeCode } from "./helpers";

const factorial = "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)";

test("breakpoints, stepping through a recursive call, and the trace table", async ({ page }) => {
  await signIn(page, STUDENTS.fay);
  await page.goto("/problems/factorial");
  await typeCode(page, factorial);

  // A breakpoint on line 4: click its line number.
  await page.locator(".cm-lineNumbers .cm-gutterElement", { hasText: /^4$/ }).click();
  await expect(page.locator(".cm-breakpoint-dot:visible")).toHaveCount(1);

  await page.getByRole("tab", { name: "Debugger" }).click();
  await expect(page.locator("#debug-call")).toHaveValue("factorial(5)");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  const status = page.locator("#panel-debugger p[aria-live]");
  await expect(status).toContainText("About to run line 4", { timeout: 60_000 });
  await expect(status).toContainText("Breakpoint");
  await expect(page.locator(".cm-debug-line")).toContainText("return n * factorial(n - 1)");

  // On to the same line one call deeper: two calls on the stack.
  await page.getByRole("button", { name: "Continue" }).click();
  const stack = page.locator("#panel-debugger ol li button");
  await expect(stack).toHaveCount(2);
  await expect(stack.first()).toContainText("factorial(n=4)");
  await expect(stack.nth(1)).toContainText("waiting at line 4");

  await page.getByRole("button", { name: "Step out" }).click();
  await expect(status).toContainText("factorial(n=4) returns 24");

  // Back, and the scrubber to the very end.
  await page.getByRole("button", { name: "Back" }).click();
  await page.locator(".timeline input").focus();
  await page.keyboard.press("End");
  await expect(page.locator("#panel-debugger")).toContainText("Result: 120");
  await expect(page.locator(".trace-table")).toBeVisible();

  // Changing the code makes the run out of date.
  await page.locator(".cm-content").click();
  await page.keyboard.press("ControlOrMeta+End");
  await page.keyboard.type(" ");
  await expect(page.getByText("You have changed the code since this run")).toBeVisible();
  await expect(page.locator(".cm-debug-line")).toHaveCount(0);
});

test("the console calls the code with any input, and keeps what is made in it", async ({ page }) => {
  await signIn(page, STUDENTS.fay);
  await page.goto("/problems/factorial");
  await typeCode(page, factorial);
  await page.getByRole("tab", { name: "Console" }).click();
  const line = page.getByLabel("Python line to run");
  await line.fill("factorial(6)");
  await line.press("Enter");
  await expect(page.locator("#panel-console")).toContainText("720", { timeout: 60_000 });
  await line.fill("x = factorial(3)");
  await line.press("Enter");
  await line.fill("x * 2");
  await line.press("Enter");
  await expect(page.locator("#panel-console")).toContainText("12");
  await line.fill("factorial(-1)");
  await line.press("Enter");
  await expect(page.locator("#panel-console")).toContainText("RecursionError");
  // Up brings back the last line.
  await line.press("ArrowUp");
  await expect(line).toHaveValue("factorial(-1)");
  // input() is not available: functions get their data as parameters.
  await line.fill("input()");
  await line.press("Enter");
  await expect(page.locator("#panel-console")).toContainText("input() is not available");
});
