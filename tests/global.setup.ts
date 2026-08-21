import { expect } from '@playwright/test';
import { test } from '../fixtures/hooks-fixtures';

test('Global Setup (Auth storage state) for Auto Login', async ({
  page,
  decryptedValidCredentials,
  loginPage,
}) => {
  const url = process.env.BASE_URL as string;
  const app_username = decryptedValidCredentials.app_username;
  const app_password = decryptedValidCredentials.app_password;
  console.log(`Decrypted Username: ${decryptedValidCredentials.app_username}`);
  console.log(`Decrypted Password: ${decryptedValidCredentials.app_password}`);
  await loginPage.goToOrangeHRMLoginPage(url);
  await loginPage.loginToOrangeHRM(app_username, app_password);
  expect(page).toHaveURL(/dashboard/);
  await page.context().storageState({ path: './playwright/.auth/globalStorageState.json' });
});

/** 
 *  Configuration 1 @file: playwright.config.ts
 *  Below configuration is added in playwright.config.ts to use the storage state for auto login in all test cases.
 *  Usage of storage state (in playwright.config.ts) to avoid login for every test case:
 * 
 *  projects: [
     {
       name: 'setup',
       testMatch: 'global.setup.ts',
     },
 
     {
       name: 'chromium',
       use: { ...devices['Desktop Chrome'], 
         storageState: 'playwright/.auth/globalStorageState.json'
        },
       dependencies: ['setup'],
     },
 
 */

/**
 * Configuration 2 @file: tests/storageStateExampleUsage.spec.ts
 * Usage of storage state (in test file) to avoid login for every test case.
 * Add the below code snippet inside describe block of the test file to use the storage state for auto login in all test cases in a particular spec file.
 *  
 * test.use({
    storageState: "playwright/.auth/globalStorageState.json"
  });
 */
