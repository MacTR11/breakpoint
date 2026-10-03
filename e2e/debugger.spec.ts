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

  // How many times each line ran, beside the line numbers.
  await expect(page.locator(".cm-run-count")).toHaveText(["6×", "1×", "5×"]);

  // The recursion tree: six calls, each returning to the one that made it.
  await page.getByRole("button", { name: "Calls (6)" }).click();
  await expect(page.locator(".call-node")).toHaveCount(6);
  await expect(page.locator(".call-node", { hasText: "factorial(0)" })).toContainText("→ 1");
  await expect(page.locator(".call-node", { hasText: "factorial(5)" })).toHaveAttribute("data-state", "running");
  await page.locator(".call-node", { hasText: "factorial(2)" }).click();
  await expect(status).toContainText("Calling factorial(n=2)");

  await page.getByRole("button", { name: "Trace table" }).click();
  await expect(page.locator(".trace-table")).toBeVisible();

  // Changing the code makes the run out of date.
  await page.locator(".cm-content").click();
  await page.keyboard.press("ControlOrMeta+End");
  await page.keyboard.type(" ");
  await expect(page.getByText("You have changed the code since this run")).toBeVisible();
  await expect(page.locator(".cm-debug-line")).toHaveCount(0);
});

test("a list is drawn as bars, with the index variables pointing into it", async ({ page }) => {
  await signIn(page, STUDENTS.fay);
  await page.goto("/problems/binary-search");
  await typeCode(
    page,
    [
      "def binary_search(items, target):",
      "    low = 0",
      "    high = len(items) - 1",
      "    while low <= high:",
      "        mid = (low + high) // 2",
      "        if items[mid] == target:",
      "            return mid",
      "        if items[mid] < target:",
      "            low = mid + 1",
      "        else:",
      "            high = mid - 1",
      "    return -1",
    ].join("\n"),
  );
  await page.locator(".cm-lineNumbers .cm-gutterElement", { hasText: /^6$/ }).click();
  await page.getByRole("tab", { name: "Debugger" }).click();
  await page.locator("#debug-call").fill("binary_search([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23)");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  // First time round: the whole list is still in the search.
  await expect(page.locator(".list-cell")).toHaveCount(10, { timeout: 60_000 });
  await expect(page.locator(".list-cell[data-outside]")).toHaveCount(0);
  // Second time round: only the top half is left, between low and high.
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator(".list-cell[data-outside]")).toHaveCount(5);
  await expect(page.locator(".list-marker").filter({ hasText: /\S/ })).toHaveText(["low", "mid", "high"]);
  await expect(page.getByRole("img", { name: /items: 2, 5, 8/ })).toBeVisible();
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
