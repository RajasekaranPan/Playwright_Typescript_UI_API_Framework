import { Page } from '@playwright/test';

export class KeyboardActions {
  constructor(private readonly page: Page) {}

  // ============================================================
  // PRESS
  // ============================================================

  /**
   * Press a keyboard key or key combination.
   *
   * Examples:
   * - Enter
   * - Escape
   * - ArrowDown
   * - Control+A
   * - Control+C
   */
  async press(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  // ============================================================
  // TYPE
  // ============================================================

  /**
   * Type text using keyboard events.
   *
   * This simulates individual keyboard input events.
   */
  async type(
    text: string,
    options?: {
      delay?: number;
    },
  ): Promise<void> {
    await this.page.keyboard.type(text, {
      delay: options?.delay,
    });
  }

  // ============================================================
  // INSERT TEXT
  // ============================================================

  /**
   * Insert text without generating individual
   * keyboard events for each character.
   */
  async insertText(text: string): Promise<void> {
    await this.page.keyboard.insertText(text);
  }

  // ============================================================
  // KEY DOWN
  // ============================================================

  /**
   * Press and hold a keyboard key.
   */
  async keyDown(key: string): Promise<void> {
    await this.page.keyboard.down(key);
  }

  // ============================================================
  // KEY UP
  // ============================================================

  /**
   * Release a previously pressed keyboard key.
   */
  async keyUp(key: string): Promise<void> {
    await this.page.keyboard.up(key);
  }
}
