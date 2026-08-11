import { test } from '../../fixtures/hooks-fixtures';
import { expect } from '@playwright/test';
//import loginData from '../../data/json/orangeHRM.json';
// We generate JSON file from Excel file using TestDataLoader class just for reference. We are not using the JSON file directly in the test. 
// Instead, we are using the TestDataLoader class to load the data from the Excel file and use it in the test. 
// This approach ensures that we always have the latest data from the Excel file and we don't have to manually update the JSON file whenever the Excel file changes.

import { TestDataLoader } from '../../utils/TestDataLoader';
import { LoginTestData } from '../../types/LoginTestData';
//Best Approach:  Excel -> Parser -> JS Typed object -> Tests
// Reason for not importing the JSON file directly:
// 1. Type Safety: By using a loader function, you can define TypeScript interfaces or types for your test data. This ensures that the data being loaded adheres to the expected structure, providing type safety and reducing the risk of runtime errors.
// 2. Dynamic Data Loading: A loader function allows you to load data dynamically at runtime. This is particularly useful if your test data is subject to change or if you want to load different datasets based on certain conditions (e.g., environment variables).
// 3. Preprocessing: A loader function can include preprocessing logic, such as filtering, transforming, or validating the data before it is used in tests. This can help ensure that the test data is in the correct format and meets specific criteria.
// 4. Separation of Concerns: By encapsulating the data loading logic in a separate function or module, you maintain a clear separation of concerns between your test code and the data management logic. This can make your tests more maintainable and easier to understand.
// 5. Reusability: A loader function can be reused across multiple test files or test suites, promoting code reuse and reducing duplication. This can be especially beneficial in larger test projects with multiple test cases that rely on the same data.
// 6. Error Handling: A loader function can include error handling mechanisms to gracefully handle issues that may arise during data loading, such as missing files or invalid data formats. This can help prevent test failures due to data-related issues.

import {CredentialsManager} from '../../utils/CredentialsManager'
import { EnvironmentManager } from '../../utils/EnvironmentManager';

test.describe('Testdata driven testing',() => {

const loginData: LoginTestData[] = TestDataLoader.getLoginData();

//Parameterization vs Fixtures:
//Parameterization:
//username
//password
//expectedResult
//Fixtures:
//Fixtures are used to set up the test environment and provide common functionality for multiple tests. 
//loginPage
//userProfileMenu


//Another topic - Never store real passwords in Excel
//Resolve credentials through 
// Environment variable
// Secret manager -> study
// Vault
// CI secret

loginData.forEach(data => {

    test(`${data.Scenario} - USER: ${data.UsernameKey}`,
        {tag: ['@login', '@regression']},
     async ({page, commonUtils, loginPage, userProfileMenu}) => {
        
        await loginPage.goToOrangeHRMLoginPage(EnvironmentManager.getBaseUrl());

        const credentials = CredentialsManager.getCredentials(
            data.UsernameKey, data.PasswordKey );

            let decryptedUserName = commonUtils.decryptData(credentials.username);
            let decryptedPassword = commonUtils.decryptData(credentials.password);

        await loginPage.loginToOrangeHRM(decryptedUserName, decryptedPassword);

         if (data.ExpectedResult === 'success') {
                await expect(page).toHaveURL(/dashboard/);
            } else {
                await expect(
                    page.getByText('Invalid credentials')
                ).toBeVisible();
            }
    });
    
});

});
