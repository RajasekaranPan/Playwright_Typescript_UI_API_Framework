import { LoginPage } from '../pages/LoginPage';
import { UserProfileMenu } from '../sections/UserProfileMenu';
import { EnvironmentManager } from '../utils/EnvironmentManager';
import { test as base } from './common-fixtures';

type Fixtures = {
  decryptedValidCredentials: {
    app_username: string;
    app_password: string;
  };

  authenticate: UserProfileMenu;
};

//Example of Test Fixtures
//Before any test we can use this decrypted credentials
//Usage: @ tests\without-hooks-test_1.spec.ts
const test = base.extend<Fixtures>({
  decryptedValidCredentials: async ({ commonUtils }, use) => {
    const encryptedUsername = process.env.VALID_USERNAME as string;
    const encryptedPassword = process.env.VALID_PASSWORD as string;

    const app_username = commonUtils.decryptData(encryptedUsername);
    const app_password = commonUtils.decryptData(encryptedPassword);

    await use({
      app_username,
      app_password,
    });
  },

  // Usage: @ tests\ui-tests\authenticationFixtureTest.spec.ts
  authenticate: async ({ page, loginPage, decryptedValidCredentials }, use) => {
    const url = EnvironmentManager.getBaseUrl();
    const app_username = decryptedValidCredentials.app_username;
    const app_password = decryptedValidCredentials.app_password;
    await loginPage.goToOrangeHRMLoginPage(url);
    await loginPage.loginToOrangeHRM(app_username, app_password);
    await page.waitForLoadState('domcontentloaded');
    await use(new UserProfileMenu(page));
  },
  // It is handled via global storage state test in all the test globally.
});

export { test };
