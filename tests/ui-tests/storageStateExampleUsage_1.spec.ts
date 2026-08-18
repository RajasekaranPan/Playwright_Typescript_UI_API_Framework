import { expect } from "@playwright/test";
import { test } from "../../fixtures/common-fixtures";

test.describe('Global login and test hooks example',() => {

  // NOTE: StorageState functionality -> Either tests\storageStateExampleUsage_1.spec.ts works 
  // or tests\storageStateExampleUsage_2.spec.ts works
    /**
     *
     * Run below command to execute this test file in headed mode with HTML report generation
    * $ ENV_NAME=qa SECRET_KEY=raja143 npx playwright test tests/storageStateExampleUsage_3.spec.ts 
    * --project=storageStateTests --headed
    */

// test.use({
//     storageState: "playwright/.auth/globalStorageState.json"
//   });

  test.beforeEach(async ({page, loginPage}) => {
    let url = process.env.BASE_URL as string;
    await loginPage.goToOrangeHRMLoginPage(url);
    await expect(page).toHaveURL(/dashboard/);
  });

  test.afterEach(async ({page, userProfileMenu}) => {
     await userProfileMenu.clickOnHamburgerMenu();
    await userProfileMenu.clickLogoutLink();
    await expect(page).toHaveURL(/auth/);
  });

test('Validate Login and goto Support page', {tag: ['@login', '@UAT', '@UI'],
    annotation: [{
        type: "Test Case Link",
        description: "https:jira.com/"
    },
    {type: "Defect",
        description: "https:jira.com/defects"
    }]
    },
    async ({page, userProfileMenu}) => {
    await userProfileMenu.clickOnHamburgerMenu();
    await userProfileMenu.clickOnSupportLink();
    await expect(page).toHaveURL(/support/);
})

});