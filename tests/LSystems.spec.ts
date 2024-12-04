import {expect, Page, test} from '@playwright/test';

class Application {
  constructor(private page: Page) {}

  async start() {
    await this.page.goto("http://localhost:5173");
  }
}

class User {
  constructor(private page: Page) {}

  async expectPageToHaveNiceQuote() {
    await expect(await this.page.getByText("Alan Kay")).toBeVisible();
  }

  async startApplication() {
    const quote = this.page.getByText("Alan Kay");
    await quote.click();
    await expect(quote).not.toBeVisible();

    const canvas = this.page.getByTestId("l-systems-canvas-renderer");
    await expect(canvas).toBeVisible();
  }

  async setLSystemIterationsTo(iterations: number) {
    const iterationsInput = this.page.getByRole("spinbutton", {name: "iterations"});
    await iterationsInput.fill(String(iterations));
  }
}

test("The application loads", async ({ page }) => {
  const user = new User(page);
  const application = new Application(page);

  await application.start()
  await user.expectPageToHaveNiceQuote();
});

test("The application renders", async ({page}) => {
  const user = new User(page);
  const application = new Application(page);

  await application.start()
  await user.startApplication();
});

test("The canvas renderer doesn't hang at high iterations", async ({page}) => {
  const user = new User(page);
  const application = new Application(page);

  await application.start()
  await user.startApplication();

  const startTime = Date.now();
  await user.setLSystemIterationsTo(7);
  const endTime = Date.now();

  const renderTime = endTime - startTime;
  expect(renderTime).toBeLessThan(50);
});
