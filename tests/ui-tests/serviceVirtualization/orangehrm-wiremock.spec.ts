import { test } from '../../../fixtures/hooks-fixtures';
import { expect } from '@playwright/test';
import { EmployeeListPage } from '../../../pages/EmployeeListsPage';
import { EnvironmentManager } from '../../../utils/EnvironmentManager';

test.describe(
  'Service Virualization => Playwright Intercept + WireMock',
  { tag: ['@Regression'], annotation: [{ type: 'Story', description: 'www.jira.com/story' }] },

  () => {
    test.use({
      storageState: 'playwright/.auth/globalStorageState.json',
    });
    test(
      'WireMock test',
      {
        tag: ['@EndToEnd', '@network'],
        annotation: [
          {
            type: 'Test Case Link',
            description: 'https:jira.com/',
          },
          { type: 'Defect', description: 'https:jira.com/defects' },
        ],
      },
      async ({ page, loginPage }) => {
        await test.step('Navigate to Orange HRM Login Page followed by PIM', async () => {
          await loginPage.goToOrangeHRMLoginPage(EnvironmentManager.getBaseUrl());
        });

        await page.route('**/web/index.php/api/v2/pim/employees**', async (route) => {
          const request = route.request();

          const wireMockUrl = `http://localhost:8080${new URL(request.url()).pathname}`;

          console.log('Original URL:', request.url());
          console.log('WireMock URL:', wireMockUrl);

          const wireMockResponse = await route.fetch({
            url: wireMockUrl,
          });

          console.log('WireMock response status:', wireMockResponse.status());

          await route.fulfill({
            response: wireMockResponse,
          });
        });

        await page.goto(
          'https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList',
        );

        const employeeListPage = new EmployeeListPage(page);

        const employees = await employeeListPage.fetchEmployeeData();

        // Validate number of employees
        expect(employees).toHaveLength(1);

        // Validate employee data
        expect(employees[0]).toEqual({
          id: 'SV001',
          firstName: 'Stubbed',
          lastName: 'Employee',
        });
      },
    );
  },
);
