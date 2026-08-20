// Wrapper around Playwright APIs

import { Page, Locator, Frame } from '@playwright/test';

import { NavigationActions } from './NavigationActions';
import { WaitActions } from './WaitActions';
import { KeyboardActions } from './KeyboardActions';
import { MouseActions } from './MouseActions';
import { FrameActions } from './FrameActions';
import { FileActions } from './FileActions';
import { DialogActions } from './DailogActions';

export class PlaywrightActions {
  //Element/Locator actions + common actions
  readonly navigation: NavigationActions;
  readonly wait: WaitActions;
  readonly keyboard: KeyboardActions;
  readonly mouse: MouseActions;
  readonly frame: FrameActions;
  readonly file: FileActions;
  readonly dialog: DialogActions;

  constructor(page: Page) {
    this.navigation = new NavigationActions(page);

    this.wait = new WaitActions(page);

    this.keyboard = new KeyboardActions(page);

    this.mouse = new MouseActions(page);

    this.frame = new FrameActions(page);

    this.file = new FileActions(page);

    this.dialog = new DialogActions(page);
  }

  // ============================================================
  // CLICK ACTIONS
  // ============================================================

  async click(
    locator: Locator,
    options?: {
      timeout?: number;
      force?: boolean;
      noWaitAfter?: boolean;
    },
  ): Promise<void> {
    await locator.click({
      timeout: options?.timeout,
      force: options?.force,
      noWaitAfter: options?.noWaitAfter,
    });
  }

  async doubleClick(
    locator: Locator,
    options?: {
      timeout?: number;
      force?: boolean;
    },
  ): Promise<void> {
    await locator.dblclick({
      timeout: options?.timeout,
      force: options?.force,
    });
  }

  // ============================================================
  // INPUT ACTIONS
  // ============================================================

  async fill(locator: Locator, value: string, timeout?: number): Promise<void> {
    await locator.fill(value, {
      timeout,
    });
  }

  async clear(locator: Locator, timeout?: number): Promise<void> {
    await locator.fill('', {
      timeout,
    });
  }

  async press(locator: Locator, key: string, timeout?: number): Promise<void> {
    await locator.press(key, {
      timeout,
    });
  }

  async type(
    locator: Locator,
    text: string,
    options?: {
      delay?: number;
      timeout?: number;
    },
  ): Promise<void> {
    await locator.pressSequentially(text, {
      delay: options?.delay,
      timeout: options?.timeout,
    });
  }

  // ============================================================
  // CHECKBOX / RADIO
  // ============================================================

  async check(locator: Locator, timeout?: number): Promise<void> {
    await locator.check({
      timeout,
    });
  }

  async uncheck(locator: Locator, timeout?: number): Promise<void> {
    await locator.uncheck({
      timeout,
    });
  }

  // ============================================================
  // SELECT
  // ============================================================

  async selectOption(locator: Locator, value: string, timeout?: number): Promise<void> {
    await locator.selectOption(value, {
      timeout,
    });
  }

  // ============================================================
  // MOUSE / ELEMENT ACTIONS
  // ============================================================

  async hover(locator: Locator, timeout?: number): Promise<void> {
    await locator.hover({
      timeout,
    });
  }

  async focus(locator: Locator, timeout?: number): Promise<void> {
    await locator.focus({
      timeout,
    });
  }

  async scrollIntoView(locator: Locator, timeout?: number): Promise<void> {
    await locator.scrollIntoViewIfNeeded({
      timeout,
    });
  }

  async dragTo(source: Locator, target: Locator, timeout?: number): Promise<void> {
    await source.dragTo(target, {
      timeout,
    });
  }

  // ============================================================
  // ELEMENT INFORMATION
  // ============================================================

  async getText(locator: Locator, timeout?: number): Promise<string> {
    return (
      await locator.innerText({
        timeout,
      })
    ).trim();
  }

  async getTextContent(locator: Locator, timeout?: number): Promise<string | null> {
    return locator.textContent({
      timeout,
    });
  }

  async getInputValue(locator: Locator, timeout?: number): Promise<string> {
    return locator.inputValue({
      timeout,
    });
  }

  async getAttribute(
    locator: Locator,
    attribute: string,
    timeout?: number,
  ): Promise<string | null> {
    return locator.getAttribute(attribute, {
      timeout,
    });
  }

  async getCount(locator: Locator): Promise<number> {
    return locator.count();
  }

  // ============================================================
  // ELEMENT STATE
  // ============================================================

  async isVisible(locator: Locator, timeout?: number): Promise<boolean> {
    return locator.isVisible({
      timeout,
    });
  }

  async isHidden(locator: Locator): Promise<boolean> {
    return locator.isHidden();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  async isDisabled(locator: Locator): Promise<boolean> {
    return locator.isDisabled();
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return locator.isChecked();
  }

  async isEditable(locator: Locator): Promise<boolean> {
    return locator.isEditable();
  }
}
