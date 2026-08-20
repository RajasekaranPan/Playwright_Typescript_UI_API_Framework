import { Locator, Page } from '@playwright/test';
import { PlaywrightActions } from '../core/playwright/PlaywrightActions';
import { BasePage } from '../core/BasePage';
import { fi } from '@faker-js/faker';

export class PersonalDetailsPage extends BasePage {
  readonly addAttachmentButton: Locator;
  readonly browseButton: Locator;

  readonly commentBox: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addAttachmentButton = page.getByRole('button', { name: 'Add' });
    this.browseButton = page.getByText('Browse');

    this.commentBox = page.getByRole('textbox', { name: 'Type comment here' });
    this.saveButton = page.getByRole('button', { name: 'Save' }).nth(2);
  }

  async clickAddAttachmentButton(): Promise<void> {
    await this.actions.scrollIntoView(this.addAttachmentButton);
    await this.page.waitForTimeout(5000);
    await this.actions.click(this.addAttachmentButton);
  }

  async uploadFileUsingBrowse(file: string): Promise<void> {
    //await this.actions.click(this.browseButton);
    await this.actions.file.uploadUsingChooser(async () => {
      await this.actions.click(this.browseButton);
    }, file);
  }

  async fillCommentBox(text: string): Promise<void> {
    await this.actions.click(this.commentBox);
    await this.actions.fill(this.commentBox, text);
  }

  async clickSaveButton(): Promise<void> {
    await this.actions.click(this.saveButton);
  }

  async validateSavedData(file: string): Promise<void> {
    const dynamicLocator: Locator = this.page
      .getByRole('row')
      .locator(`//div[text()='${file}']`)
      .last();

    await this.actions.wait.forVisible(dynamicLocator, 5000);
  }
}
