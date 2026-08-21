import { expect } from '@playwright/test';
import { test } from '../../fixtures/hooks-fixtures';

test.describe('Without both fixtures and hooks tests example', async () => {
  test.use({
    storageState: {
      cookies: [],
      origins: [],
    },
  });

  /**
     * Run below command to execute this test file in headed mode with HTML report generation
    $ ENV_NAME=qa SECRET_KEY=raja143 npx playwright test tests/without-hooks-test_1.spec.ts --project=chromium --headed
     */
  test(
    'Validate Login and Logout',
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
    async ({ decryptedValidCredentials, page, loginPage, userProfileMenu }) => {
      const url = process.env.BASE_URL as string;
      console.log(`Decrypted Username: ${decryptedValidCredentials.app_username}`);
      console.log(`Decrypted Password: ${decryptedValidCredentials.app_password}`);
      await loginPage.goToOrangeHRMLoginPage(url);
      await loginPage.loginToOrangeHRM(
        decryptedValidCredentials.app_username,
        decryptedValidCredentials.app_password,
      );
      await userProfileMenu.clickOnHamburgerMenu();
      await userProfileMenu.clickLogoutLink();
      await expect(page).toHaveURL(/auth/);
    },
  );

  test('Validate Login and goto Support page', async ({
    page,
    decryptedValidCredentials,
    loginPage,
    userProfileMenu,
  }) => {
    const url = process.env.BASE_URL as string;
    console.log(`Decrypted Username: ${decryptedValidCredentials.app_username}`);
    console.log(`Decrypted Password: ${decryptedValidCredentials.app_password}`);
    await loginPage.goToOrangeHRMLoginPage(url);

    await loginPage.loginToOrangeHRM(
      decryptedValidCredentials.app_username,
      decryptedValidCredentials.app_password,
    );
    await userProfileMenu.clickOnHamburgerMenu();
    await userProfileMenu.clickOnSupportLink();
    await expect(page).toHaveURL(/support/);
  });
});
