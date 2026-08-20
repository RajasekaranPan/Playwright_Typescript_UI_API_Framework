import { Page, Response } from '@playwright/test';

type NavigationWaitUntil = 'load' | 'domcontentloaded' | 'networkidle' | 'commit';

type LoadState = 'load' | 'domcontentloaded' | 'networkidle';

export class NavigationActions {
  constructor(private readonly page: Page) {}

  // ============================================================
  // BASIC NAVIGATION
  // ============================================================

  /**
   * Navigate to the specified URL.
   */
  async goto(
    url: string,
    options?: {
      timeout?: number;
      waitUntil?: NavigationWaitUntil;
      referer?: string;
    },
  ): Promise<Response | null> {
    return await this.page.goto(url, {
      timeout: options?.timeout,
      waitUntil: options?.waitUntil ?? 'load',
      referer: options?.referer,
    });
  }

  /**
   * Navigate back to the previous page.
   */
  async goBack(options?: {
    timeout?: number;
    waitUntil?: NavigationWaitUntil;
  }): Promise<Response | null> {
    return await this.page.goBack({
      timeout: options?.timeout,
      waitUntil: options?.waitUntil,
    });
  }

  /**
   * Navigate forward in browser history.
   */
  async goForward(options?: {
    timeout?: number;
    waitUntil?: NavigationWaitUntil;
  }): Promise<Response | null> {
    return await this.page.goForward({
      timeout: options?.timeout,
      waitUntil: options?.waitUntil,
    });
  }

  /**
   * Reload the current page.
   */
  async reload(options?: {
    timeout?: number;
    waitUntil?: NavigationWaitUntil;
  }): Promise<Response | null> {
    return await this.page.reload({
      timeout: options?.timeout,
      waitUntil: options?.waitUntil,
    });
  }

  // ============================================================
  // URL INFORMATION
  // ============================================================

  /**
   * Get the current page URL.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get the current page URL as a URL object.
   */
  getCurrentUrlObject(): URL {
    return new URL(this.page.url());
  }

  /**
   * Get protocol of current URL.
   */
  getProtocol(): string {
    return this.getCurrentUrlObject().protocol;
  }

  /**
   * Get hostname of current URL.
   */
  getHostname(): string {
    return this.getCurrentUrlObject().hostname;
  }

  /**
   * Get pathname of current URL.
   */
  getPathname(): string {
    return this.getCurrentUrlObject().pathname;
  }

  /**
   * Get query string.
   */
  getSearch(): string {
    return this.getCurrentUrlObject().search;
  }

  /**
   * Get hash fragment.
   */
  getHash(): string {
    return this.getCurrentUrlObject().hash;
  }

  // ============================================================
  // URL WAITING
  // ============================================================

  /**
   * Wait until URL matches the expected URL.
   */
  async waitForUrl(
    url: string | RegExp,
    options?: {
      timeout?: number;
      waitUntil?: NavigationWaitUntil;
    },
  ): Promise<void> {
    await this.page.waitForURL(url, {
      timeout: options?.timeout,
      waitUntil: options?.waitUntil,
    });
  }

  /**
   * Wait until URL contains specified text.
   */
  async waitForUrlContains(expectedText: string, timeout?: number): Promise<void> {
    await this.page.waitForURL((url) => url.toString().includes(expectedText), {
      timeout,
    });
  }

  /**
   * Wait until pathname matches expected value.
   */
  async waitForPath(expectedPath: string, timeout?: number): Promise<void> {
    await this.page.waitForURL((url) => url.pathname === expectedPath, {
      timeout,
    });
  }

  /**
   * Wait until URL changes from current URL.
   */
  async waitForUrlChange(timeout?: number): Promise<void> {
    const currentUrl = this.page.url();

    await this.page.waitForURL((url) => url.toString() !== currentUrl, {
      timeout,
    });
  }

  // ============================================================
  // LOAD STATE
  // ============================================================

  /**
   * Wait for page load state.
   */
  async waitForLoadState(state: LoadState = 'load', timeout?: number): Promise<void> {
    await this.page.waitForLoadState(state, {
      timeout,
    });
  }

  /**
   * Wait for DOMContentLoaded.
   */
  async waitForDomContentLoaded(timeout?: number): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', {
      timeout,
    });
  }

  /**
   * Wait for load event.
   */
  async waitForLoad(timeout?: number): Promise<void> {
    await this.page.waitForLoadState('load', {
      timeout,
    });
  }

  /**
   * Wait for network idle.
   *
   * Use carefully. Prefer locator-based waits for
   * application readiness whenever possible.
   */
  async waitForNetworkIdle(timeout?: number): Promise<void> {
    await this.page.waitForLoadState('networkidle', {
      timeout,
    });
  }

  // ============================================================
  // PAGE TITLE
  // ============================================================

  /**
   * Get current page title.
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  // ============================================================
  // PAGE CONTENT
  // ============================================================

  /**
   * Get complete HTML content of the page.
   */
  async getContent(): Promise<string> {
    return await this.page.content();
  }

  // ============================================================
  // PAGE WAITING
  // ============================================================

  /**
   * Wait for a specified amount of time.
   *
   * Prefer explicit waits whenever possible.
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  // ============================================================
  // PAGE VISIBILITY / STATE
  // ============================================================

  /**
   * Check whether page is closed.
   */
  isClosed(): boolean {
    return this.page.isClosed();
  }

  // ============================================================
  // BROWSER HISTORY
  // ============================================================

  /**
   * Go back multiple times.
   */
  async goBackMultiple(
    count: number,
    options?: {
      timeout?: number;
      waitUntil?: NavigationWaitUntil;
    },
  ): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.page.goBack({
        timeout: options?.timeout,
        waitUntil: options?.waitUntil,
      });
    }
  }

  /**
   * Go forward multiple times.
   */
  async goForwardMultiple(
    count: number,
    options?: {
      timeout?: number;
      waitUntil?: NavigationWaitUntil;
    },
  ): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.page.goForward({
        timeout: options?.timeout,
        waitUntil: options?.waitUntil,
      });
    }
  }

  // ============================================================
  // PAGE EVENTS
  // ============================================================

  /**
   * Wait for a popup/new page.
   *
   * The actual click/action that triggers the popup should
   * normally be performed outside this method using
   * Promise.all().
   */
  async waitForPopup(action: () => Promise<void>, timeout?: number): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup', {
      timeout,
    });

    await action();

    return await popupPromise;
  }

  // ============================================================
  // NAVIGATION WITH ACTION
  // ============================================================

  /**
   * Perform an action and wait for navigation.
   *
   * Useful for traditional navigation scenarios.
   */
  async waitForNavigation(
    action: () => Promise<void>,
    options?: {
      timeout?: number;
      waitUntil?: NavigationWaitUntil;
    },
  ): Promise<Response | null> {
    const responsePromise = this.page.waitForNavigation({
      timeout: options?.timeout,
      waitUntil: options?.waitUntil,
    });

    await action();

    return await responsePromise;
  }
}
