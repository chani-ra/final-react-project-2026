import { expect, test } from "@playwright/test";

// Read-only smoke coverage. These tests never register, submit AI prompts,
// create lessons, or mutate production records.
test("home page renders and offers login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/EnglishWise/i);
  await expect(page.getByRole("button", { name: "התחברות" })).toBeVisible();
});

test("login page exposes a usable form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "התחברות", exact: true })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "כניסה למערכת" })).toBeVisible();
});

for (const path of ["/dashboard", "/chat", "/teacher/students", "/admin/learning", "/courses/ai-lesson"]) {
  test(`guest is redirected from protected route ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login\/?(?:\?.*)?$/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
}

const accounts = [
  {
    role: "STUDENT",
    home: "/dashboard",
    destination: "/courses/ai-lesson",
    heading: "השיעור הבא שלך מתחיל כאן",
  },
  {
    role: "TEACHER",
    home: "/teacher/dashboard",
    destination: "/teacher/students",
    heading: /חברי הקורסים שלי/,
  },
  {
    role: "ADMIN",
    home: "/admin/dashboard",
    destination: "/admin/learning",
    heading: "היסטוריית שיעורי AI",
  },
];

for (const account of accounts) {
  test(`${account.role.toLowerCase()} logs in and can access an allowed page`, async ({ page }) => {
    const email = process.env[`E2E_${account.role}_EMAIL`];
    const password = process.env[`E2E_${account.role}_PASSWORD`];
    test.skip(!email || !password, `Set E2E_${account.role}_EMAIL and E2E_${account.role}_PASSWORD for this optional test`);

    await page.goto("/login");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole("button", { name: "כניסה למערכת" }).click();
    await expect(page).toHaveURL(new RegExp(`${account.home.replaceAll("/", "\\/")}/?$`));

    await page.goto(account.destination);
    await expect(page.getByRole("heading", { name: account.heading })).toBeVisible();
  });
}
