import { expect, type Page } from "@playwright/test";
import { loadContent, type ContentProblem } from "../prisma/content";
import type { Account } from "./accounts";

export async function signIn(page: Page, who: Account) {
  await page.goto("/login");
  await page.getByLabel("Username").fill(who.username);
  await page.getByLabel("Password").fill(who.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

/** A problem as its content file has it: model answers, hidden tests and all. Only the tests read these. */
export function problem(slug: string): ContentProblem {
  const found = loadContent().find((p) => p.slug === slug);
  if (!found) throw new Error(`No content file for ${slug}`);
  return found;
}

/**
 * Replace what is in the code editor by typing, a line at a time, as a student
 * would: each new line's automatic indent is cleared first, so the code's own
 * indentation is kept.
 */
export async function typeCode(page: Page, code: string) {
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Delete");
  const lines = code.trimEnd().split("\n");
  for (const [index, line] of lines.entries()) {
    if (index > 0) {
      await page.keyboard.press("Enter");
      await page.keyboard.press("Shift+Home");
      await page.keyboard.press("Delete");
    }
    await page.keyboard.type(line);
  }
}

/** The page's HTML and everything the browser was sent for it, as one string to search. */
export async function everythingSent(page: Page, path: string) {
  const response = await page.request.get(path);
  return response.text();
}

/** Every way `text` could appear in a page: as it is, escaped as HTML, or escaped once or twice inside the page's data. */
export function forms(text: string) {
  const html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  const once = JSON.stringify(text).slice(1, -1);
  const twice = JSON.stringify(once).slice(1, -1);
  return [...new Set([text, html, once, twice])];
}

/** Whether `text` appears anywhere in what was sent, in any of its forms. */
export const contains = (sent: string, text: string) => forms(text).some((form) => sent.includes(form));

/** Paste `text` into the code editor as though from another window or website. */
export async function pasteFromOutside(page: Page, text: string) {
  await page.locator(".cm-content").click();
  await page.evaluate((text) => {
    const data = new DataTransfer();
    data.setData("text/plain", text);
    document.querySelector(".cm-content")!.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
  }, text);
}

/** The teacher's choice of what happens to large pastes. */
export async function setPasteMode(page: Page, mode: "record" | "block") {
  await page.goto("/teacher/settings");
  await page.getByText(mode === "block" ? "Record and block them" : "Record large pastes").click();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(mode === "block" ? "large pastes are refused" : "large pastes are allowed")).toBeVisible();
}
