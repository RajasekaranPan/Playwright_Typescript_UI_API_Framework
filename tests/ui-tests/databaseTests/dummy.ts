import { test, expect } from '@playwright/test';
import { Db2Queries } from '../../../utils/DatabaseUtils/Db2Queries';

// NOTE: It wont wprk as DB credentials are just imaginary ones.

// Now the responsibility is nicely separated:

// Db2Connection

// "I execute SQL and return rows of type T."

// Db2Queries

// "I know what SQL I'm executing and what T looks like."

// Test

// "I validate the business result."

// By having interface model for returned query results
// result
//   ↓
// Employee[]
//   ↓
// result[0]
//   ↓
// Employee
//   ↓
// EMPLOYEE_ID: number

//Hence the original unknown error disappears.

test(
  'Validate employee in DB',
  {
    tag: ['@UI', '@Database'],
    annotation: [
      {
        type: 'Test Case Link',
        description: 'https:jira.com/',
      },
      { type: 'Defect', description: 'https:jira.com/defects' },
    ],
  },
  async () => {
    const employeeId = 1001;

    // NOTE: It wont wprk as DB credentials are just imaginary ones.
    const result = await Db2Queries.getEmployeeById(employeeId);

    expect(result).toHaveLength(1);
    expect(result[0].EMPLOYEE_ID).toBe(employeeId);

    // NOTE: It wont wprk as DB credentials are just imaginary ones.
    // const result2 = await Db2Queries.getEmployeesUnderManager(100, 'IT');

    // console.log(result2);
  },
);
