import { expect } from '@playwright/test';
import { test } from '../../fixtures/hooks-fixtures';
import { EnvironmentManager } from '../../utils/EnvironmentManager';

test.describe('Global login setup and fixtures tests example', () => {
  test.use({
    storageState: 'playwright/.auth/globalStorageState.json',
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
    async ({ page, loginPage, userProfileMenu }) => {
      //goToUrl fixture will navigate to the OrangeHRM login page
      //and login to the application using the credentials from environment variables
      await loginPage.goToOrangeHRMLoginPage(EnvironmentManager.getBaseUrl());
      await userProfileMenu.clickOnHamburgerMenu();
      await userProfileMenu.clickOnSupportLink();
      await expect(page).toHaveURL(/support/);
    },
  );
});
