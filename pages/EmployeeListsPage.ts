import { Page, Locator } from '@playwright/test';
import { MockedEmployeeRecord } from '../types/mockedEmployeeData';
export class EmployeeListPage {
  private readonly employeeListsSection: Locator;
  private readonly employeeRows: Locator;

  constructor(private readonly page: Page) {
    this.employeeListsSection = page.locator('.oxd-table-body');
    this.employeeRows = this.employeeListsSection.getByRole('row');
  }

  async fetchEmployeeData(): Promise<MockedEmployeeRecord[]> {
    await this.employeeListsSection.scrollIntoViewIfNeeded();

    const rowCount = await this.employeeRows.count();

    const employeeRecords: MockedEmployeeRecord[] = [];

    for (let i = 0; i < rowCount; i++) {
      const row = this.employeeRows.nth(i);

      const dataCells = row.locator('div.data');

      const id = (await dataCells.nth(0).innerText()).trim();
      const firstName = (await dataCells.nth(1).innerText()).trim();
      const lastName = (await dataCells.nth(2).innerText()).trim();

      employeeRecords.push({
        id,
        firstName,
        lastName,
      });
    }

    return employeeRecords;
  }
}
