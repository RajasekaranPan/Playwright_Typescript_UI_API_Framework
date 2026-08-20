import { test as base } from './authenticate-fixtures';

type Hooks = {
  beforeAfterHook: void; // Just load the URL at the begining
  // and Logout after every test ends.
};

const test = base.extend<Hooks>({
  beforeAfterHook: async ({ loginPage, userProfileMenu }, use) => {
    // BEFORE TEST
    console.log('Before Test: Navigating to OrangeHRM login page and logging in');
    await loginPage.goToOrangeHRMLoginPage(process.env.BASE_URL as string);

    // TEST EXECUTION
    console.log('Executing the test');
    await use();

    // AFTER TEST
    console.log('After Test: Logging out from OrangeHRM application');
    await userProfileMenu.clickOnHamburgerMenu();
    await userProfileMenu.clickLogoutLink();
  },
});

export { test };
