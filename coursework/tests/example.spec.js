// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test("error message", async({page}) => {
  await page.goto("http://127.0.0.1:3000/people.html");

  await page.getByLabel("Search by driver name:").fill("hola");

  await page.getByRole("button").click();

  const paragraph = page.locator("#message");

  await expect(paragraph).toHaveText("");
});