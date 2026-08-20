import { expect } from '@playwright/test';
import { test } from '../../fixtures/common-fixtures';

/**
 * Run this test file using the command:
 * npx playwright test tests/with-hooks-test.spec.ts
 */
test.describe('Without fixtures but with hooks tests example', () => {
  /**
   *
   * Run below command to execute this test file in headed mode with HTML report generation
   * $ ENV_NAME=qa SECRET_KEY=raja143 npx playwright test tests/with-hooks-test_2.spec.ts --project=chromium --headed
   */

  test.use({
    storageState: {
      cookies: [],
      origins: [],
    },
  });

  test.beforeEach(async ({ page, commonUtils, loginPage }) => {
    let url = process.env.BASE_URL as string;
    let encryptedUsernameFromEnv = process.env.VALID_USERNAME as string;
    let encryptedPasswordFromEnv = process.env.VALID_PASSWORD as string;
    let decryptedUsername = commonUtils.decryptData(encryptedUsernameFromEnv);
    let decryptedPassword = commonUtils.decryptData(encryptedPasswordFromEnv);
    console.log(`Decrypted Username: ${decryptedUsername}`);
    console.log(`Decrypted Password: ${decryptedPassword}`);
    await loginPage.goToOrangeHRMLoginPage(url);
    await loginPage.loginToOrangeHRM(decryptedUsername, decryptedPassword);
    await expect(page).toHaveURL(/dashboard/);
  });

  test(
    'Validate Login and goto Support page',
    {
      tag: ['@login', '@UAT', '@UI'],
      annotation: [
        {
          type: 'Test Case Link',
          description: 'https:jira.com/',
        },
        { type: 'Defect', description: 'https:jira.com/defects' },
      ],
    },
    async ({ page, userProfileMenu }) => {
      await userProfileMenu.clickOnHamburgerMenu();
      await userProfileMenu.clickOnSupportLink();
      await expect(page).toHaveURL(/support/);
    },
  );

  test('Validate Login and check if Logout link is present', async ({ page, userProfileMenu }) => {
    await userProfileMenu.clickOnHamburgerMenu();
    const isLogoutPresent = await userProfileMenu.checkIflogoutPresent();
    expect(isLogoutPresent).toBe(true);
  });

  test.afterEach(async ({ page, userProfileMenu }) => {
    // Logout after each test to ensure a clean state for the next test
    await userProfileMenu.clickOnHamburgerMenu();
    await userProfileMenu.clickLogoutLink();
    await expect(page).toHaveURL(/auth/);
  });
});
