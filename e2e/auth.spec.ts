import { expect, test } from "@playwright/test";
import { STUDENTS, TEACHER } from "./accounts";
import { signIn } from "./helpers";

test("a wrong password is refused, and the right one signs in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Username").fill(STUDENTS.ann.username);
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);

  await signIn(page, STUDENTS.ann);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ann");
});

test("pages need a sign-in, and teacher pages need the teacher", async ({ page }) => {
  await page.goto("/problems");
  await expect(page).toHaveURL(/\/login/);
  expect((await page.request.get("/api/palette")).status()).toBe(401);

  await signIn(page, STUDENTS.ann);
  for (const path of ["/teacher", "/teacher/classes", "/teacher/settings", "/present"]) {
    await page.goto(path);
    await expect(page, `${path} is for the teacher`).toHaveURL("/");
  }
});

test("the teacher signs in with the .env account and sees the dashboard", async ({ page }) => {
  await signIn(page, TEACHER);
  await page.goto("/teacher");
  await expect(page).toHaveURL("/teacher");
  await expect(page.getByRole("link", { name: STUDENTS.ann.name })).toBeVisible();
});

test("a missing page is a Python traceback", async ({ page }) => {
  await signIn(page, STUDENTS.ann);
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("KeyError")).toBeVisible();
});
