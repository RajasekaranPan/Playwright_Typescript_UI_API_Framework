import { expect } from "@playwright/test";
import { test } from "../fixtures/common-fixtures";

test('Global Setup (Auth storage state) for Auto Login',async ({page,commonUtils, loginPage}) => {
    let url = process.env.BASE_URL as string;
    let encryptedUsernameFromEnv = process.env.VALID_USERNAME as string;
    let encryptedPasswordFromEnv = process.env.VALID_PASSWORD as string;
    let decryptedUsername = commonUtils.decryptData(encryptedUsernameFromEnv);
    let decryptedPassword = commonUtils.decryptData(encryptedPasswordFromEnv);
    console.log(`Decrypted Username: ${decryptedUsername}`);
    console.log(`Decrypted Password: ${decryptedPassword}`);
    await loginPage.goToOrangeHRMLoginPage(url);
    await loginPage.loginToOrangeHRM(decryptedUsername, decryptedPassword);
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