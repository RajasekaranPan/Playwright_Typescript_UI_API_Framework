import { expect } from "@playwright/test";
import { test } from "../fixtures/common-fixtures";
import { log } from "node:console";


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

test('Validate landing page',     {tag: ['@login', '@UAT', '@UI', '@VisualTesting'],
    annotation: [{
        type: "Test Case Link",
        description: "https:jira.com/"
    },
    {type: "Defect",
        description: "https:jira.com/defects"
    }]
    },
    async ({ loginPage}) => {
    await expect(loginPage.page).toHaveTitle(/OrangeHRM/);
    //Run once and have the base image created and then rerun this test once again to validate
    await expect(loginPage.loginButton).toHaveScreenshot('LoginButton.png');

})


});
