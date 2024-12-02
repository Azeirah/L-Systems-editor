import {expect, test} from '@playwright/test';

test('Test page loads', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(await page.getByText("Alan Kay")).toBeVisible();
});
