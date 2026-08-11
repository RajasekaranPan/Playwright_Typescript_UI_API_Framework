import { expect } from "@playwright/test";
import { test } from "../fixtures/common-fixtures";

test.describe('Without both fixtures and hooks tests example',() => {

    test.use({
        storageState: {
            cookies: [],
            origins: []
    }});


    /**
     * Run below command to execute this test file in headed mode with HTML report generation
    $ ENV_NAME=qa SECRET_KEY=raja143 npx playwright test tests/without-hooks-test_1.spec.ts --project=chromium --headed
     */
test('Validate Login and Logout', async ({ commonUtils, loginPage, userProfileMenu}) => {
    let url = process.env.BASE_URL as string;
    let encryptedUsernameFromEnv = process.env.ORG_HRM_USR_NAME as string;
    let encryptedPasswordFromEnv = process.env.ORG_HRM_PASSWORD as string;
    let decryptedUsername = commonUtils.decryptData(encryptedUsernameFromEnv);
    let decryptedPassword = commonUtils.decryptData(encryptedPasswordFromEnv);
    console.log(`Decrypted Username: ${decryptedUsername}`);
    console.log(`Decrypted Password: ${decryptedPassword}`);
    await loginPage.goToOrangeHRMLoginPage(url);
    await loginPage.loginToOrangeHRM(decryptedUsername, decryptedPassword);
    await userProfileMenu.clickOnHamburgerMenu();
    await userProfileMenu.clickLogoutLink();
    await expect(userProfileMenu.page).toHaveURL(/auth/);
})

test('Validate Login and goto Support page', async ({commonUtils, loginPage, userProfileMenu}) => {
    let url = process.env.BASE_URL as string;
    let encryptedUsernameFromEnv = process.env.ORG_HRM_USR_NAME as string;
    let encryptedPasswordFromEnv = process.env.ORG_HRM_PASSWORD as string;
    let decryptedUsername = commonUtils.decryptData(encryptedUsernameFromEnv);
    let decryptedPassword = commonUtils.decryptData(encryptedPasswordFromEnv);
    console.log(`Decrypted Username: ${decryptedUsername}`);
    console.log(`Decrypted Password: ${decryptedPassword}`);
    await loginPage.goToOrangeHRMLoginPage(url);
    await loginPage.loginToOrangeHRM(decryptedUsername, decryptedPassword);
    await userProfileMenu.clickOnHamburgerMenu();
    await userProfileMenu.clickOnSupportLink();
    await expect(userProfileMenu.page).toHaveURL(/support/);
})

});