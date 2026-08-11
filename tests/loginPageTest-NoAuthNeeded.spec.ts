import { expect } from "@playwright/test";
import { test } from "../fixtures/common-fixtures";


test.describe('Landing Page Validation',() => {
  
test.use({
        storageState: {
            cookies: [],
            origins: []
    }});

test.beforeEach(async ({commonUtils, loginPage}) => {
    let url = process.env.BASE_URL as string;
    await loginPage.goToOrangeHRMLoginPage(url);
});

test('Validate landing page', async ({ loginPage}) => {
    await expect(loginPage.page).toHaveTitle(/OrangeHRM/);
})


});
