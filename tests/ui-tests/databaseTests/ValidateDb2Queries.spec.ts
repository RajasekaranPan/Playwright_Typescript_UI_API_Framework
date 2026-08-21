import { test, expect } from '@playwright/test';
import { Db2Queries } from '../../../utils/DatabaseUtils/Db2Queries';

test.describe(
  'DB2 - Basic SELECT and WHERE Queries',
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
  () => {
    test('should retrieve employee by employee ID', async () => {
      const employeeId = 1;

      const result = await Db2Queries.getEmployeeById(employeeId);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].EMPLOYEE_ID).toBe(employeeId);
    });

    test('should retrieve employee by email', async () => {
      const email = 'raj.kumar@demo.com';

      const result = await Db2Queries.getEmployeeByEmail(email);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].EMAIL).toBe(email);
    });

    test('should retrieve all active employees', async () => {
      const result = await Db2Queries.getActiveEmployees();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(employee.EMPLOYMENT_STATUS).toBe('ACTIVE');
      });
    });

    test('should retrieve employees with salary greater than threshold', async () => {
      const minimumSalary = 100000;

      const result = await Db2Queries.getEmployeesWithSalaryGreaterThan(minimumSalary);

      result.forEach((employee) => {
        expect(Number(employee.SALARY)).toBeGreaterThan(minimumSalary);
      });
    });

    test('should retrieve employees within salary range', async () => {
      const minimumSalary = 70000;
      const maximumSalary = 100000;

      const result = await Db2Queries.getEmployeesWithinSalaryRange(minimumSalary, maximumSalary);

      result.forEach((employee) => {
        const salary = Number(employee.SALARY);

        expect(salary).toBeGreaterThanOrEqual(minimumSalary);
        expect(salary).toBeLessThanOrEqual(maximumSalary);
      });
    });

    test('should retrieve employees from requested departments', async () => {
      const departmentIds = [1, 2, 3];

      const result = await Db2Queries.getEmployeesByDepartmentIds(departmentIds);

      result.forEach((employee) => {
        expect(departmentIds).toContain(employee.DEPARTMENT_ID);
      });
    });

    test('should retrieve employees using first name prefix', async () => {
      const prefix = 'R';

      const result = await Db2Queries.getEmployeesByFirstNamePrefix(prefix);

      result.forEach((employee) => {
        expect(employee.FIRST_NAME.toUpperCase()).toMatch(/^R/);
      });
    });

    test('should retrieve employees by city', async () => {
      const city = 'Chennai';

      const result = await Db2Queries.getEmployeesByCity(city);

      result.forEach((employee) => {
        expect(employee.CITY).toBe(city);
      });
    });

    test('should retrieve employees by department and minimum salary', async () => {
      const departmentId = 1;
      const minimumSalary = 80000;

      const result = await Db2Queries.getEmployeesByDepartmentAndMinimumSalary(
        departmentId,
        minimumSalary,
      );

      result.forEach((employee) => {
        expect(employee.DEPARTMENT_ID).toBe(departmentId);
        expect(Number(employee.SALARY)).toBeGreaterThanOrEqual(minimumSalary);
      });
    });
  },
);

test.describe(
  'DB2 - Sorting, DISTINCT and Pagination',
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
  () => {
    test('should return employees sorted by salary descending', async () => {
      const result = await Db2Queries.getEmployeesSortedBySalaryDescending();

      expect(result.length).toBeGreaterThan(0);

      for (let i = 1; i < result.length; i++) {
        expect(Number(result[i - 1].SALARY)).toBeGreaterThanOrEqual(Number(result[i].SALARY));
      }
    });

    test('should return employees sorted by department and salary', async () => {
      const result = await Db2Queries.getEmployeesSortedByDepartmentAndSalary();

      expect(result.length).toBeGreaterThan(0);
    });

    test('should return distinct employee cities', async () => {
      const result = await Db2Queries.getDistinctEmployeeCities();

      const cities = result.map((item) => item.CITY);

      expect(new Set(cities).size).toBe(cities.length);
    });

    test('should return requested number of top paid employees', async () => {
      const limit = 5;

      const result = await Db2Queries.getTopPaidEmployees(limit);

      expect(result.length).toBeLessThanOrEqual(limit);
    });
  },
);

test.describe(
  'DB2 - NULL and CASE Queries',
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
  () => {
    test('should retrieve employees without managers', async () => {
      const result = await Db2Queries.getEmployeesWithoutManager();

      result.forEach((employee) => {
        expect(employee.MANAGER_ID).toBeNull();
      });
    });

    test('should classify employees into salary bands', async () => {
      const result = await Db2Queries.getEmployeesWithSalaryBand();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(['HIGH', 'MEDIUM', 'LOW']).toContain(employee.SALARY_BAND);
      });
    });
  },
);

test.describe(
  'DB2 - Aggregate Functions',
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
  () => {
    test('should return employee count', async () => {
      const result = await Db2Queries.getEmployeeCount();

      expect(result).toHaveLength(1);
      expect(Number(result[0].EMPLOYEE_COUNT)).toBeGreaterThan(0);
    });

    test('should return employee salary statistics', async () => {
      const result = await Db2Queries.getEmployeeSalaryStatistics();

      expect(result).toHaveLength(1);

      const statistics = result[0];

      expect(Number(statistics.EMPLOYEE_COUNT)).toBeGreaterThan(0);
      expect(Number(statistics.MIN_SALARY)).toBeLessThanOrEqual(Number(statistics.MAX_SALARY));
      expect(Number(statistics.AVG_SALARY)).toBeGreaterThanOrEqual(Number(statistics.MIN_SALARY));
    });

    test('should return employee statistics by department', async () => {
      const result = await Db2Queries.getDepartmentEmployeeStatistics();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((department) => {
        expect(Number(department.EMPLOYEE_COUNT)).toBeGreaterThan(0);
      });
    });

    test('should return departments having minimum employee count', async () => {
      const minimumEmployeeCount = 2;

      const result = await Db2Queries.getDepartmentsWithMinimumEmployeeCount(minimumEmployeeCount);

      result.forEach((department) => {
        expect(Number(department.EMPLOYEE_COUNT)).toBeGreaterThanOrEqual(minimumEmployeeCount);
      });
    });

    test('should return departments with high average salary', async () => {
      const minimumAverageSalary = 80000;

      const result = await Db2Queries.getDepartmentsWithHighAverageSalary(minimumAverageSalary);

      result.forEach((department) => {
        expect(Number(department.AVG_SALARY)).toBeGreaterThan(minimumAverageSalary);
      });
    });
  },
);

test.describe(
  'DB2 - JOIN Queries',
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
  () => {
    test('should retrieve employees with department information', async () => {
      const result = await Db2Queries.getEmployeesWithDepartments();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(employee.DEPARTMENT_NAME).toBeTruthy();
      });
    });

    test('should retrieve employees with their managers', async () => {
      const result = await Db2Queries.getEmployeesWithManager();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(employee.FIRST_NAME).toBeTruthy();
      });
    });

    test('should retrieve employees under manager and department', async () => {
      const managerId = 1;
      const departmentId = 1;

      const result = await Db2Queries.getEmployeesUnderManager(managerId, departmentId);

      result.forEach((employee) => {
        expect(employee.DEPARTMENT_NAME).toBeTruthy();
        expect(employee.MANAGER_NAME).toBeTruthy();
      });
    });

    test('should retrieve all employees with optional dependents', async () => {
      const result = await Db2Queries.getAllEmployeesWithOptionalDependents();

      expect(result.length).toBeGreaterThan(0);
    });

    test('should retrieve employees without dependents', async () => {
      const result = await Db2Queries.getEmployeesWithoutDependents();

      result.forEach((employee) => {
        expect(employee.EMPLOYEE_ID).toBeTruthy();
      });
    });

    test('should retrieve all medical plans using RIGHT JOIN', async () => {
      const result = await Db2Queries.getAllMedicalPlansWithEnrollments();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((plan) => {
        expect(plan.MED_PLAN_ID).toBeTruthy();
        expect(plan.PLAN_NAME).toBeTruthy();
      });
    });

    test('should validate FULL OUTER JOIN between employees and medical plans', async () => {
      const result = await Db2Queries.getEmployeesAndMedicalEnrollmentsFullOuterJoin();
      expect(result.length).toBeGreaterThan(0);
    });

    test('should generate employee and medical plan combinations using CROSS JOIN', async () => {
      const result = await Db2Queries.getEmployeeMedicalPlanCombinations();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((record) => {
        expect(record.EMPLOYEE_ID).toBeTruthy();
        expect(record.MED_PLAN_ID).toBeTruthy();
      });
    });
  },
);

test.describe(
  'DB2 - Multiple JOIN Queries',
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
  () => {
    test('should retrieve employee organization and medical benefits', async () => {
      const result = await Db2Queries.getEmployeeOrganizationAndMedicalBenefits();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(employee.EMPLOYEE_NAME).toBeTruthy();

        // Medical plan can be null because this query uses LEFT JOIN.
        if (employee.MEDICAL_PLAN !== null) {
          expect(employee.MEDICAL_PLAN).toBeTruthy();
        }
      });
    });

    test('should retrieve complete health benefits for employees', async () => {
      const result = await Db2Queries.getEmployeesWithCompleteHealthBenefits();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(employee.MEDICAL_PLAN).toBeTruthy();
        expect(employee.DENTAL_PLAN).toBeTruthy();
        expect(employee.VISION_PLAN).toBeTruthy();
      });
    });

    test('should calculate employee total benefit premiums', async () => {
      const result = await Db2Queries.getEmployeeTotalBenefitPremiums();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(Number(employee.TOTAL_EMPLOYEE_PREMIUM)).toBeGreaterThanOrEqual(0);
      });
    });
  },
);

test.describe(
  'DB2 - SubQueries',
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
  () => {
    test('should retrieve employees above company average salary', async () => {
      const result = await Db2Queries.getEmployeesAboveAverageSalary();

      expect(result.length).toBeGreaterThan(0);
    });

    test('should retrieve employees above department average salary', async () => {
      const result = await Db2Queries.getEmployeesAboveDepartmentAverageSalary();

      expect(result.length).toBeGreaterThan(0);
    });

    test('should retrieve employees having dependents using EXISTS', async () => {
      const result = await Db2Queries.getEmployeesHavingDependentsUsingExists();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(employee.EMPLOYEE_ID).toBeDefined();
      });
    });

    test('should retrieve employees without dependents using NOT EXISTS', async () => {
      const result = await Db2Queries.getEmployeesWithoutDependentsUsingNotExists();

      expect(result).toBeDefined();
    });

    test('should retrieve employees enrolled in a specific medical plan using IN subquery', async () => {
      const planCode = 'MED_PREMIUM';

      const result = await Db2Queries.getEmployeesByMedicalPlanCode(planCode);

      expect(result).toBeDefined();

      for (const employee of result) {
        expect(employee.EMPLOYEE_ID).toBeDefined();
      }
    });
    test('should retrieve employees paid more than every HR employee', async () => {
      const hrDepartmentId = 2;

      const result =
        await Db2Queries.getEmployeesPaidMoreThanEveryEmployeeInDepartment(hrDepartmentId);

      expect(result).toBeDefined();
    });
  },
);

test.describe(
  'DB2 - Dependent Aggregation',
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
  () => {
    test('should return employee dependent counts', async () => {
      const result = await Db2Queries.getEmployeeDependentCounts();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(Number(employee.DEPENDENT_COUNT)).toBeGreaterThanOrEqual(0);
      });
    });

    test('should return employees having multiple dependents', async () => {
      const minimumDependents = 2;

      const result = await Db2Queries.getEmployeesWithMultipleDependents(minimumDependents);

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(employee.DEPENDENT_COUNT).toBeGreaterThanOrEqual(minimumDependents);
      });
    });

    test('should retrieve employees hired after supplied date', async () => {
      const hireDate = '2020-01-01';

      const result = await Db2Queries.getEmployeesHiredAfter(hireDate);

      const expectedHireDate = new Date(hireDate);

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(employee.HIRE_DATE).toBeDefined();

        if (employee.HIRE_DATE) {
          const actualHireDate = new Date(employee.HIRE_DATE);

          expect(actualHireDate.getTime()).toBeGreaterThan(expectedHireDate.getTime());
        }
      });
    });

    test('should calculate employee ages', async () => {
      const result = await Db2Queries.getEmployeeAges();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(Number(employee.AGE)).toBeGreaterThan(0);
      });
    });
  },
);
test.describe(
  'DB2 - SET Operators',
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
  () => {
    test('should return employees with medical or dental benefits using UNION', async () => {
      const result = await Db2Queries.getEmployeesWithMedicalOrDentalBenefits();

      expect(result.length).toBeGreaterThan(0);
    });

    test('should return employees with medical and dental benefits using INTERSECT', async () => {
      const result = await Db2Queries.getEmployeesWithMedicalAndDentalBenefits();

      expect(result).toBeDefined();
    });

    test('should return employees with medical but without dental using EXCEPT', async () => {
      const result = await Db2Queries.getEmployeesWithMedicalButWithoutDental();

      expect(result).toBeDefined();
    });

    test('should return all medical and dental enrollment records using UNION ALL', async () => {
      const result = await Db2Queries.getAllMedicalAndDentalEnrollmentRecords();

      expect(result.length).toBeGreaterThan(0);
    });
  },
);

test.describe(
  'DB2 - 401K Business Rules',
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
  () => {
    test('should validate 401K catch-up eligibility', async () => {
      const result = await Db2Queries.get401KCatchupEligibility();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        const age = Number(employee.AGE);
        const catchupAmount = Number(employee.CATCHUP_CONTRIBUTION_AMOUNT);

        if (age >= 50) {
          expect(catchupAmount).toBeGreaterThan(0);
        } else {
          expect(catchupAmount).toBe(0);
        }
      });
    });

    test('should not have any 401K contribution rule violations', async () => {
      const violations = await Db2Queries.get401KContributionRuleViolations();

      expect(violations, '401K contribution business-rule violations found').toHaveLength(0);
    });
  },
);

test.describe(
  'DB2 - CTE Queries',
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
  () => {
    test('should retrieve department statistics using CTE', async () => {
      const result = await Db2Queries.getDepartmentEmployeeCountsUsingCte();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((department) => {
        expect(Number(department.EMPLOYEE_COUNT)).toBeGreaterThan(0);
      });
    });
  },
);

test.describe(
  'DB2 - Window Functions',
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
  () => {
    test('should rank employees by salary', async () => {
      const result = await Db2Queries.getEmployeesRankedBySalary();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(Number(employee.SALARY_RANK)).toBeGreaterThan(0);
      });
    });

    test('should rank employees by salary within department', async () => {
      const result = await Db2Queries.getEmployeesRankedByDepartmentSalary();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(Number(employee.DEPARTMENT_SALARY_RANK)).toBeGreaterThan(0);
      });
    });

    test('should calculate running employee salary total', async () => {
      const result = await Db2Queries.getRunningEmployeeSalaryTotal();

      expect(result.length).toBeGreaterThan(0);

      for (let i = 1; i < result.length; i++) {
        expect(Number(result[i].RUNNING_SALARY_TOTAL)).toBeGreaterThanOrEqual(
          Number(result[i - 1].RUNNING_SALARY_TOTAL),
        );
      }
    });
  },
);

test.describe(
  'DB2 - Benefits Validation',
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
  () => {
    test('should identify active employees without medical coverage', async () => {
      const result = await Db2Queries.getActiveEmployeesWithoutMedicalCoverage();

      result.forEach((employee) => {
        expect(employee.EMPLOYMENT_STATUS).toBe('ACTIVE');
      });
    });

    test('should retrieve employees with complete health benefits', async () => {
      const result = await Db2Queries.getEmployeesWithCompleteHealthBenefits();

      result.forEach((employee) => {
        expect(employee.MEDICAL_PLAN).toBeTruthy();
        expect(employee.DENTAL_PLAN).toBeTruthy();
        expect(employee.VISION_PLAN).toBeTruthy();
      });
    });

    test('should calculate total employee benefit premiums', async () => {
      const result = await Db2Queries.getEmployeeTotalBenefitPremiums();

      expect(result.length).toBeGreaterThan(0);

      result.forEach((employee) => {
        expect(Number(employee.TOTAL_EMPLOYEE_PREMIUM)).toBeGreaterThanOrEqual(0);
      });
    });
  },
);
