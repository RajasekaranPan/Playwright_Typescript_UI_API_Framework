import {test as base} from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { UserProfileMenu } from "../sections/UserProfileMenu";

/**
 * Fixture for page object model. 
 * This fixture will create an instance of LoginPage and make it available to the test.
 * The test can then use this fixture to access the methods and properties of the LoginPage class.
 * Extension of Playwright test with custom fixtures is done using the `base.extend` method.
 * 
 * The `loginPage` fixture is defined as an asynchronous function that takes the `page` object as a parameter.
 * It creates a new instance of the LoginPage class and passes the `page` object to its constructor.
 * The `use` function is then called with the newly created instance of LoginPage, making it available to the test. 
 * Usage:
 * 
 * import { test } from "../fixtures/pom-fixtures";
 * 
 * test('Login into Orange HRM', async ({loginPage}) => {
 *     await loginPage.goToOrangeHRMLoginPage();
 *     await loginPage.loginToOrangeHRM('Admin', 'admin123');
 * })
 */

type MyFixtures = {
    loginPage: LoginPage;
    userProfileMenu: UserProfileMenu;
}   

const test = base.extend<MyFixtures>({
    loginPage: async ({page}, use) => {    
        await use(new LoginPage(page));
    },

    userProfileMenu: async ({page}, use) => {
        await use(new UserProfileMenu(page));
    }
    
});

export { test };