import { test } from '../../../fixtures/hooks-fixtures';
import {expect} from '@playwright/test'; 
import { EnvironmentManager } from '../../../utils/EnvironmentManager';
import { EmployeeListPage } from '../../../pages/EmployeeListsPage';


test.describe('Playwright Special Feature',{tag: ['@Regression'],
    annotation: [{type:"Story", description: "www.jira.com/story"}]
},

() => {

 test.use({
    storageState: "playwright/.auth/globalStorageState.json"
  });
 test('Network interceptor test', {tag: ['@EndToEnd','@network'],
    annotation: [{
        type: "Test Case Link",
        description: "https:jira.com/"
    },
    {type: "Defect",
        description: "https:jira.com/defects"
    }]
    },
     async ({page, loginPage}) => {
        
    await test.step('Navigate to Orange HRM Login Page followed by PIM', async() => {
        await loginPage.goToOrangeHRMLoginPage(EnvironmentManager.getBaseUrl());


    });

    
    // Network mocking
    await page.route(
        '**/web/index.php/api/v2/pim/employees**',
        async route => {

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: [
                        {
                            empNumber: 9999,
                            lastName: 'Mock',
                            firstName: 'Raj',
                            middleName: 'QA',
                            employeeId: 'MOCK001',
                            terminationId: null,
                            jobTitle: {
                                id: null,
                                title: null,
                                isDeleted: null
                            },
                            subunit: {
                                id: null,
                                name: null
                            },
                            empStatus: {
                                id: null,
                                name: null
                            },
                            supervisors: []
                        }
                    ],
                    meta: {
                        total: 1
                    },
                    rels: []
                })
            });
        }
    );

    await page.goto(
        'https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList'
    );

    const employeeListPage = new EmployeeListPage(page);

    const employees = await employeeListPage.fetchEmployeeData();

    // Validate number of employees
    expect(employees).toHaveLength(1);

    // Validate employee data
    expect(employees[0]).toEqual({
        id: 'MOCK001',
        firstName: 'Raj',
        lastName: 'Mock'
    });
});

});
