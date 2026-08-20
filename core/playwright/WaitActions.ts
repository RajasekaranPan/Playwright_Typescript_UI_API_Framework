import { expect, Locator, Page } from '@playwright/test';

export class WaitActions {
  constructor(private readonly page: Page) {}

  /**
   * Wait until an element becomes visible.
   */
  async forVisible(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeVisible({
      timeout,
    });
  }

  /**
   * Wait until an element becomes hidden.
   */
  async forHidden(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeHidden({
      timeout,
    });
  }

  /**
   * Wait until an element becomes enabled.
   */
  async forEnabled(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeEnabled({
      timeout,
    });
  }

  /**
   * Wait until an element becomes disabled.
   */
  async forDisabled(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator).toBeDisabled({
      timeout,
    });
  }

  /**
   * Wait until an element contains expected text.
   */
  async forText(locator: Locator, expectedText: string | RegExp, timeout?: number): Promise<void> {
    await expect(locator).toContainText(expectedText, {
      timeout,
    });
  }

  /**
   * Wait until an input contains expected value.
   */
  async forValue(
    locator: Locator,
    expectedValue: string | RegExp,
    timeout?: number,
  ): Promise<void> {
    await expect(locator).toHaveValue(expectedValue, {
      timeout,
    });
  }

  /**
   * Wait until the page URL matches expected URL.
   */
  async forUrl(url: string | RegExp, timeout?: number): Promise<void> {
    await this.page.waitForURL(url, {
      timeout,
    });
  }

  /**
   * Wait for a specific page load state.
   */
  async forLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'load',
    timeout?: number,
  ): Promise<void> {
    await this.page.waitForLoadState(state, {
      timeout,
    });
  }
}
