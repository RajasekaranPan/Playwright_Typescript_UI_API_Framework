import { Page } from '@playwright/test';

export class MouseActions {
  constructor(private readonly page: Page) {}

  // ============================================================
  // CLICK
  // ============================================================

  /**
   * Click at the specified page coordinates.
   *
   * @param x Horizontal coordinate
   * @param y Vertical coordinate
   */
  async click(x: number, y: number): Promise<void> {
    await this.page.mouse.click(x, y);
  }

  // ============================================================
  // DOUBLE CLICK
  // ============================================================

  /**
   * Double-click at the specified page coordinates.
   *
   * @param x Horizontal coordinate
   * @param y Vertical coordinate
   */
  async doubleClick(x: number, y: number): Promise<void> {
    await this.page.mouse.dblclick(x, y);
  }

  // ============================================================
  // MOVE
  // ============================================================

  /**
   * Move the mouse to the specified page coordinates.
   *
   * @param x Horizontal coordinate
   * @param y Vertical coordinate
   */
  async move(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y);
  }

  // ============================================================
  // MOUSE DOWN
  // ============================================================

  /**
   * Press and hold a mouse button.
   *
   * @param button Mouse button to press.
   */
  async down(button: 'left' | 'middle' | 'right' = 'left'): Promise<void> {
    await this.page.mouse.down({
      button,
    });
  }

  // ============================================================
  // MOUSE UP
  // ============================================================

  /**
   * Release a mouse button.
   *
   * @param button Mouse button to release.
   */
  async up(button: 'left' | 'middle' | 'right' = 'left'): Promise<void> {
    await this.page.mouse.up({
      button,
    });
  }

  // ============================================================
  // MOUSE WHEEL
  // ============================================================

  /**
   * Scroll the page using the mouse wheel.
   *
   * @param deltaX Horizontal scroll amount.
   * @param deltaY Vertical scroll amount.
   */
  async wheel(deltaX: number, deltaY: number): Promise<void> {
    await this.page.mouse.wheel(deltaX, deltaY);
  }
}
