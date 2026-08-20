import { Page } from '@playwright/test';
import { PlaywrightActions } from './playwright/PlaywrightActions';

//A BasePage is useful only if your Page Objects genuinely share common infrastructure. Don't put application-specific methods, locators, or business logic into it.
//In short: You don't need constructor(page, actions) on every Page Object.
// For the architecture you're building, I'd use BasePage to provide page + PlaywrightActions,
// and let individual Page Objects focus purely on locators + application workflows.

export abstract class BasePage {
  protected readonly actions: PlaywrightActions;

  constructor(protected readonly page: Page) {
    this.actions = new PlaywrightActions(page);
  }
}
