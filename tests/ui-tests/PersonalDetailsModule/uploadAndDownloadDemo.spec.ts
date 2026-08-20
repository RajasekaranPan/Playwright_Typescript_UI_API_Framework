import { test } from '../../../fixtures/hooks-fixtures';

test.use({
  storageState: {
    cookies: [],
    origins: [],
  },
});

test(
  'Upload and Download functionalities',
  {},
  async ({ decryptedValidCredentials, loginPage, leftNavigationItems, personalDetailsPage }) => {
    await loginPage.goToOrangeHRMLoginPage(process.env.BASE_URL as string);

    await loginPage.loginToOrangeHRM(
      decryptedValidCredentials.app_username,
      decryptedValidCredentials.app_password,
    );
    await leftNavigationItems.clickOnMyInfoLink();

    await personalDetailsPage.clickAddAttachmentButton();
    await personalDetailsPage.uploadFileUsingBrowse('uploadfile.txt');

    await personalDetailsPage.fillCommentBox('Sample text');
    await personalDetailsPage.clickSaveButton();
    await personalDetailsPage.validateSavedData('uploadfile.txt');
  },
);
