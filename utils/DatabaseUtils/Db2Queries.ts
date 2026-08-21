import { Db2Connection } from './Db2Connection';
import {
  Employee,
  EmployeeUnderManager,
  EmployeeDepartment,
  EmployeeManager,
  EmployeeDependentSummary,
  DepartmentEmployeeStatistics,
  EmployeeSalaryStatistics,
  EmployeeSalaryBand,
  EmployeeBenefitSummary,
  Employee401KCatchupEligibility,
} from './Db2Models';

export type EmployeeDependentCount = {
  EMPLOYEE_ID: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  DEPENDENT_COUNT: number;
};

export class Db2Queries {
  // ===========================================================================
  // BASIC SELECT / WHERE
  // ===========================================================================

  /**
   * Retrieves an employee using the employee primary key.
   *
   * Example:
   * employeeId = 1
   *
   * SQL concepts:
   * SELECT + WHERE + parameterized query
   */
  static async getEmployeeById(employeeId: number): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        EMPLOYEE_CODE,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        PHONE,
        DATE_OF_BIRTH,
        GENDER,
        HIRE_DATE,
        TERMINATION_DATE,
        EMPLOYMENT_TYPE,
        EMPLOYMENT_STATUS,
        JOB_TITLE,
        SALARY,
        DEPARTMENT_ID,
        MANAGER_ID,
        WORK_LOCATION,
        COUNTRY,
        STATE,
        CITY
      FROM EMPLOYEES
      WHERE EMPLOYEE_ID = ?
    `;

    return Db2Connection.query<Employee>(sql, [employeeId]);
  }

  /**
   * Retrieves an employee using the unique email address.
   *
   * Example:
   * email = 'raj.kumar@demo.com'
   *
   * SQL concepts:
   * WHERE + VARCHAR parameter
   */
  static async getEmployeeByEmail(email: string): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        EMPLOYEE_CODE,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        EMPLOYMENT_STATUS,
        JOB_TITLE,
        SALARY
      FROM EMPLOYEES
      WHERE EMAIL = ?
    `;

    return Db2Connection.query<Employee>(sql, [email]);
  }

  /**
   * Retrieves all active employees.
   *
   * Example:
   * EMPLOYMENT_STATUS = 'ACTIVE'
   *
   * SQL concept:
   * WHERE equality filtering
   */
  static async getActiveEmployees(): Promise<Employee[]> {
    const sql = `
    SELECT
      EMPLOYEE_ID,
      FIRST_NAME,
      LAST_NAME,
      EMAIL,
      EMPLOYMENT_STATUS,
      JOB_TITLE,
      SALARY
    FROM EMPLOYEES
    WHERE EMPLOYMENT_STATUS = 'ACTIVE'
  `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Retrieves employees based on employment status.
   *
   * Example:
   * status = 'TERMINATED'
   *
   * SQL concept:
   * Parameterized filtering
   */
  static async getEmployeesByEmploymentStatus(status: string): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        EMPLOYMENT_STATUS,
        HIRE_DATE,
        TERMINATION_DATE
      FROM EMPLOYEES
      WHERE EMPLOYMENT_STATUS = ?
      ORDER BY LAST_NAME, FIRST_NAME
    `;

    return Db2Connection.query<Employee>(sql, [status]);
  }

  /**
   * Retrieves employees whose salary is greater than the supplied amount.
   *
   * Example:
   * salary = 100000
   *
   * SQL concept:
   * Comparison operator >
   */
  static async getEmployeesWithSalaryGreaterThan(salary: number): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY
      FROM EMPLOYEES
      WHERE SALARY > ?
      ORDER BY SALARY DESC
    `;

    return Db2Connection.query<Employee>(sql, [salary]);
  }

  /**
   * Retrieves employees whose salary is greater than or equal to
   * the supplied amount.
   *
   * Example:
   * salary = 80000
   *
   * SQL concept:
   * Comparison operator >=
   */
  static async getEmployeesWithSalaryAtLeast(salary: number): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY
      FROM EMPLOYEES
      WHERE SALARY >= ?
      ORDER BY SALARY DESC
    `;

    return Db2Connection.query<Employee>(sql, [salary]);
  }

  /**
   * Retrieves employees whose salary falls within a specified range.
   *
   * Example:
   * minimumSalary = 70000
   * maximumSalary = 100000
   *
   * SQL concept:
   * BETWEEN
   */
  static async getEmployeesWithinSalaryRange(
    minimumSalary: number,
    maximumSalary: number,
  ): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY
      FROM EMPLOYEES
      WHERE SALARY BETWEEN ? AND ?
      ORDER BY SALARY
    `;

    return Db2Connection.query<Employee>(sql, [minimumSalary, maximumSalary]);
  }

  /**
   * Retrieves employees belonging to any of the supplied departments.
   *
   * Example:
   * departmentIds = [1, 2, 3]
   *
   * SQL concept:
   * IN operator
   */
  static async getEmployeesByDepartmentIds(departmentIds: number[]): Promise<Employee[]> {
    if (departmentIds.length === 0) {
      return [];
    }

    const placeholders = departmentIds.map(() => '?').join(', ');

    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        DEPARTMENT_ID,
        SALARY
      FROM EMPLOYEES
      WHERE DEPARTMENT_ID IN (${placeholders})
      ORDER BY DEPARTMENT_ID, EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql, departmentIds);
  }

  /**
   * Retrieves employees whose first name starts with the supplied prefix.
   *
   * Example:
   * prefix = 'Ra'
   *
   * Could return Raj, Rahul, Ramesh, etc.
   *
   * SQL concept:
   * LIKE with wildcard
   */
  static async getEmployeesByFirstNamePrefix(prefix: string): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL
      FROM EMPLOYEES
      WHERE FIRST_NAME LIKE ?
      ORDER BY FIRST_NAME
    `;

    return Db2Connection.query<Employee>(sql, [`${prefix}%`]);
  }

  /**
   * Retrieves employees whose first name contains the supplied text.
   *
   * Example:
   * searchText = 'an'
   *
   * SQL concept:
   * LIKE + wildcard on both sides
   */
  static async searchEmployeesByFirstName(searchText: string): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL
      FROM EMPLOYEES
      WHERE FIRST_NAME LIKE ?
      ORDER BY FIRST_NAME
    `;

    return Db2Connection.query<Employee>(sql, [`%${searchText}%`]);
  }

  /**
   * Retrieves employees from a specific city.
   *
   * Example:
   * city = 'Chennai'
   *
   * SQL concept:
   * String filtering
   */
  static async getEmployeesByCity(city: string): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        CITY,
        STATE
      FROM EMPLOYEES
      WHERE CITY = ?
      ORDER BY LAST_NAME, FIRST_NAME
    `;

    return Db2Connection.query<Employee>(sql, [city]);
  }

  /**
   * Retrieves employees satisfying multiple conditions.
   *
   * Example:
   * departmentId = 1
   * minimumSalary = 80000
   *
   * SQL concept:
   * AND
   */
  static async getEmployeesByDepartmentAndMinimumSalary(
    departmentId: number,
    minimumSalary: number,
  ): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY,
        DEPARTMENT_ID
      FROM EMPLOYEES
      WHERE DEPARTMENT_ID = ?
        AND SALARY >= ?
      ORDER BY SALARY DESC
    `;

    return Db2Connection.query<Employee>(sql, [departmentId, minimumSalary]);
  }

  /**
   * Retrieves active employees from any supplied department.
   *
   * SQL concept:
   * AND + IN
   */
  static async getActiveEmployeesByDepartments(departmentIds: number[]): Promise<Employee[]> {
    if (departmentIds.length === 0) {
      return [];
    }

    const placeholders = departmentIds.map(() => '?').join(', ');

    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        DEPARTMENT_ID,
        EMPLOYMENT_STATUS
      FROM EMPLOYEES
      WHERE EMPLOYMENT_STATUS = 'ACTIVE'
        AND DEPARTMENT_ID IN (${placeholders})
      ORDER BY DEPARTMENT_ID, LAST_NAME
    `;

    return Db2Connection.query<Employee>(sql, departmentIds);
  }

  // ===========================================================================
  // DISTINCT / SORTING / PAGINATION
  // ===========================================================================

  /**
   * Retrieves unique cities in which employees are located.
   *
   * SQL concept:
   * DISTINCT
   */
  static async getDistinctEmployeeCities(): Promise<Array<{ CITY: string }>> {
    const sql = `
      SELECT DISTINCT CITY
      FROM EMPLOYEES
      WHERE CITY IS NOT NULL
      ORDER BY CITY
    `;

    return Db2Connection.query<{ CITY: string }>(sql);
  }

  /**
   * Retrieves employees sorted by salary from highest to lowest.
   *
   * SQL concept:
   * ORDER BY DESC
   */
  static async getEmployeesSortedBySalaryDescending(): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY
      FROM EMPLOYEES
      ORDER BY SALARY DESC
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Retrieves employees sorted by department and salary.
   *
   * SQL concept:
   * ORDER BY multiple columns
   */
  static async getEmployeesSortedByDepartmentAndSalary(): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        DEPARTMENT_ID,
        SALARY
      FROM EMPLOYEES
      ORDER BY DEPARTMENT_ID ASC, SALARY DESC
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Retrieves the highest-paid employees.
   *
   * Example:
   * limit = 5
   *
   * SQL concept:
   * ORDER BY + FETCH FIRST
   */
  static async getTopPaidEmployees(limit: number): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY
      FROM EMPLOYEES
      ORDER BY SALARY DESC
      FETCH FIRST ? ROWS ONLY
    `;

    return Db2Connection.query<Employee>(sql, [limit]);
  }

  /**
   * Retrieves employees using DB2 OFFSET/FETCH pagination.
   *
   * Example:
   * offset = 0
   * pageSize = 10
   *
   * SQL concept:
   * OFFSET + FETCH
   */
  static async getEmployeesPage(offset: number, pageSize: number): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        SALARY
      FROM EMPLOYEES
      ORDER BY EMPLOYEE_ID
      OFFSET ? ROWS
      FETCH NEXT ? ROWS ONLY
    `;

    return Db2Connection.query<Employee>(sql, [offset, pageSize]);
  }

  // ===========================================================================
  // NULL / CASE / CONDITIONAL
  // ===========================================================================

  /**
   * Retrieves employees who have not been assigned a manager.
   *
   * SQL concept:
   * IS NULL
   */
  static async getEmployeesWithoutManager(): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        MANAGER_ID
      FROM EMPLOYEES
      WHERE MANAGER_ID IS NULL
      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Retrieves employees who have a manager assigned.
   *
   * SQL concept:
   * IS NOT NULL
   */
  static async getEmployeesWithManager(): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        MANAGER_ID
      FROM EMPLOYEES
      WHERE MANAGER_ID IS NOT NULL
      ORDER BY MANAGER_ID, EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Classifies employees into salary bands.
   *
   * Example:
   * Salary >= 100000 → HIGH
   * Salary >= 75000  → MEDIUM
   * Otherwise        → LOW
   *
   * SQL concept:
   * CASE expression
   */
  static async getEmployeesWithSalaryBand(): Promise<EmployeeSalaryBand[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        SALARY,
        CASE
          WHEN SALARY >= 100000 THEN 'HIGH'
          WHEN SALARY >= 75000 THEN 'MEDIUM'
          ELSE 'LOW'
        END AS SALARY_BAND
      FROM EMPLOYEES
      ORDER BY SALARY DESC
    `;

    return Db2Connection.query<EmployeeSalaryBand>(sql);
  }

  /**
   * Demonstrates COALESCE by replacing NULL salary values with zero.
   *
   * SQL concept:
   * COALESCE
   */
  static async getEmployeesWithNormalizedSalary(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      FIRST_NAME: string;
      SALARY: number;
    }>
  > {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        COALESCE(SALARY, 0) AS SALARY
      FROM EMPLOYEES
      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query(sql);
  }

  // ===========================================================================
  // AGGREGATE FUNCTIONS
  // ===========================================================================

  /**
   * Returns the total number of employees.
   *
   * SQL concept:
   * COUNT(*)
   */
  static async getEmployeeCount(): Promise<Array<{ EMPLOYEE_COUNT: number }>> {
    const sql = `
      SELECT COUNT(*) AS EMPLOYEE_COUNT
      FROM EMPLOYEES
    `;

    return Db2Connection.query<{ EMPLOYEE_COUNT: number }>(sql);
  }

  /**
   * Returns employee salary statistics.
   *
   * SQL concepts:
   * COUNT, MIN, MAX, AVG, SUM
   */
  static async getEmployeeSalaryStatistics(): Promise<EmployeeSalaryStatistics[]> {
    const sql = `
      SELECT
        COUNT(*) AS EMPLOYEE_COUNT,
        MIN(SALARY) AS MIN_SALARY,
        MAX(SALARY) AS MAX_SALARY,
        AVG(SALARY) AS AVG_SALARY,
        SUM(SALARY) AS TOTAL_SALARY
      FROM EMPLOYEES
    `;

    return Db2Connection.query<EmployeeSalaryStatistics>(sql);
  }

  /**
   * Calculates employee count and average salary by department.
   *
   * SQL concept:
   * GROUP BY + aggregate functions
   */
  static async getDepartmentEmployeeStatistics(): Promise<DepartmentEmployeeStatistics[]> {
    const sql = `
      SELECT
        DEPARTMENT_ID,
        COUNT(*) AS EMPLOYEE_COUNT,
        AVG(SALARY) AS AVG_SALARY
      FROM EMPLOYEES
      GROUP BY DEPARTMENT_ID
      ORDER BY DEPARTMENT_ID
    `;

    return Db2Connection.query<DepartmentEmployeeStatistics>(sql);
  }

  /**
   * Returns departments having at least the supplied number of employees.
   *
   * Example:
   * minimumEmployeeCount = 3
   *
   * SQL concept:
   * GROUP BY + HAVING
   */
  static async getDepartmentsWithMinimumEmployeeCount(minimumEmployeeCount: number): Promise<
    Array<{
      DEPARTMENT_ID: number;
      EMPLOYEE_COUNT: number;
    }>
  > {
    const sql = `
      SELECT
        DEPARTMENT_ID,
        COUNT(*) AS EMPLOYEE_COUNT
      FROM EMPLOYEES
      GROUP BY DEPARTMENT_ID
      HAVING COUNT(*) >= ?
      ORDER BY EMPLOYEE_COUNT DESC
    `;

    return Db2Connection.query(sql, [minimumEmployeeCount]);
  }

  /**
   * Returns departments whose average salary exceeds the supplied amount.
   *
   * SQL concept:
   * GROUP BY + HAVING + AVG
   */
  static async getDepartmentsWithHighAverageSalary(minimumAverageSalary: number): Promise<
    Array<{
      DEPARTMENT_ID: number;
      AVG_SALARY: number;
    }>
  > {
    const sql = `
      SELECT
        DEPARTMENT_ID,
        AVG(SALARY) AS AVG_SALARY
      FROM EMPLOYEES
      GROUP BY DEPARTMENT_ID
      HAVING AVG(SALARY) > ?
      ORDER BY AVG_SALARY DESC
    `;

    return Db2Connection.query(sql, [minimumAverageSalary]);
  }

  /**
   * Returns the highest salary in each department.
   *
   * SQL concept:
   * GROUP BY + MAX
   */
  static async getHighestSalaryByDepartment(): Promise<
    Array<{
      DEPARTMENT_ID: number;
      HIGHEST_SALARY: number;
    }>
  > {
    const sql = `
      SELECT
        DEPARTMENT_ID,
        MAX(SALARY) AS HIGHEST_SALARY
      FROM EMPLOYEES
      GROUP BY DEPARTMENT_ID
      ORDER BY DEPARTMENT_ID
    `;

    return Db2Connection.query(sql);
  }

  // ===========================================================================
  // INNER JOIN
  // ===========================================================================

  /**
   * Retrieves employees together with their department names.
   *
   * Example:
   * Raj Kumar → Technology
   *
   * SQL concept:
   * INNER JOIN
   */
  static async getEmployeesWithDepartments(): Promise<EmployeeDepartment[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        D.DEPARTMENT_NAME,
        E.SALARY
      FROM EMPLOYEES E
      INNER JOIN DEPARTMENTS D
        ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query<EmployeeDepartment>(sql);
  }

  /**
   * Retrieves employees working under a specific manager and department.
   *
   * Example:
   * managerId = 1
   * departmentId = 2
   *
   * SQL concept:
   * Multiple INNER JOINs + WHERE
   */
  static async getEmployeesUnderManager(
    managerId: number,
    departmentId: number,
  ): Promise<EmployeeUnderManager[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        M.FIRST_NAME || ' ' || M.LAST_NAME AS MANAGER_NAME,
        D.DEPARTMENT_NAME,
        E.SALARY
      FROM EMPLOYEES E
      INNER JOIN MANAGERS M
        ON E.MANAGER_ID = M.MANAGER_ID
      INNER JOIN DEPARTMENTS D
        ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
      WHERE M.MANAGER_ID = ?
        AND D.DEPARTMENT_ID = ?
      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query<EmployeeUnderManager>(sql, [managerId, departmentId]);
  }

  // ===========================================================================
  // SELF JOIN / MANAGER HIERARCHY
  // ===========================================================================

  /**
   * Retrieves employees together with their manager information.
   *
   * Example:
   * Employee → Raj Kumar
   * Manager  → Arun Kumar
   *
   * SQL concept:
   * SELF JOIN
   *
   * Note:
   * The EMPLOYEES table references itself through MANAGER_ID.
   */
  static async getEmployeesWithTheirManagers(): Promise<EmployeeManager[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        M.FIRST_NAME || ' ' || M.LAST_NAME AS MANAGER_NAME
      FROM EMPLOYEES E
      INNER JOIN EMPLOYEES M
        ON E.MANAGER_ID = M.EMPLOYEE_ID
      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query<EmployeeManager>(sql);
  }

  /**
   * Retrieves employees who report directly to a particular manager.
   *
   * Example:
   * managerEmployeeId = 3
   *
   * SQL concept:
   * SELF JOIN + parameterized WHERE
   */
  static async getDirectReports(managerEmployeeId: number): Promise<EmployeeManager[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        M.FIRST_NAME || ' ' || M.LAST_NAME AS MANAGER_NAME
      FROM EMPLOYEES E
      INNER JOIN EMPLOYEES M
        ON E.MANAGER_ID = M.EMPLOYEE_ID
      WHERE M.EMPLOYEE_ID = ?
      ORDER BY E.LAST_NAME, E.FIRST_NAME
    `;

    return Db2Connection.query<EmployeeManager>(sql, [managerEmployeeId]);
  }

  // ===========================================================================
  // LEFT JOIN
  // ===========================================================================

  /**
   * Retrieves every employee and their dependents when available.
   *
   * Employees without dependents are still returned.
   *
   * SQL concept:
   * LEFT JOIN
   */
  static async getAllEmployeesWithOptionalDependents(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      EMPLOYEE_NAME: string;
      DEPENDENT_ID: number | null;
      DEPENDENT_NAME: string | null;
    }>
  > {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        D.DEPENDENT_ID,
        D.FIRST_NAME || ' ' || D.LAST_NAME AS DEPENDENT_NAME
      FROM EMPLOYEES E
      LEFT JOIN DEPENDENTS D
        ON E.EMPLOYEE_ID = D.EMPLOYEE_ID
      ORDER BY E.EMPLOYEE_ID, D.DEPENDENT_ID
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Retrieves employees who do not have any dependents.
   *
   * SQL concept:
   * LEFT JOIN + IS NULL
   */
  static async getEmployeesWithoutDependents(): Promise<Employee[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.LAST_NAME
      FROM EMPLOYEES E
      LEFT JOIN DEPENDENTS D
        ON E.EMPLOYEE_ID = D.EMPLOYEE_ID
      WHERE D.DEPENDENT_ID IS NULL
      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql);
  }

  // ===========================================================================
  // RIGHT JOIN
  // ===========================================================================

  /**
   * Retrieves all medical plans and matching employee enrollments.
   *
   * Plans without employees are still returned.
   *
   * SQL concept:
   * RIGHT JOIN
   */
  static async getAllMedicalPlansWithEnrollments(): Promise<
    Array<{
      MED_PLAN_ID: number;
      PLAN_NAME: string;
      EMPLOYEE_ID: number | null;
    }>
  > {
    const sql = `
      SELECT
        P.MED_PLAN_ID,
        P.PLAN_NAME,
        E.EMPLOYEE_ID
      FROM EMPLOYEE_MED_ENROLLMENT E
      RIGHT JOIN MED_PLANS P
        ON E.MED_PLAN_ID = P.MED_PLAN_ID
      ORDER BY P.MED_PLAN_ID, E.EMPLOYEE_ID
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Retrieves all departments and their employees using RIGHT JOIN.
   *
   * SQL concept:
   * RIGHT JOIN + NULL handling
   */
  static async getAllDepartmentsWithEmployeesUsingRightJoin(): Promise<
    Array<{
      DEPARTMENT_ID: number;
      DEPARTMENT_NAME: string;
      EMPLOYEE_ID: number | null;
      EMPLOYEE_NAME: string | null;
    }>
  > {
    const sql = `
      SELECT
        D.DEPARTMENT_ID,
        D.DEPARTMENT_NAME,
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME
      FROM EMPLOYEES E
      RIGHT JOIN DEPARTMENTS D
        ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
      ORDER BY D.DEPARTMENT_ID, E.EMPLOYEE_ID
    `;

    return Db2Connection.query(sql);
  }

  // ===========================================================================
  // FULL OUTER JOIN
  // ===========================================================================

  /**
   * Compares employees with medical enrollment.
   *
   * Employees without enrollment and enrollment records without
   * matching employees can both be identified.
   *
   * SQL concept:
   * FULL OUTER JOIN
   */
  static async getEmployeesAndMedicalEnrollmentsFullOuterJoin(): Promise<
    Array<{
      EMPLOYEE_ID: number | null;
      EMPLOYEE_NAME: string | null;
      ENROLLMENT_ID: number | null;
    }>
  > {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        EM.ENROLLMENT_ID
      FROM EMPLOYEES E
      FULL OUTER JOIN EMPLOYEE_MED_ENROLLMENT EM
        ON E.EMPLOYEE_ID = EM.EMPLOYEE_ID
      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query(sql);
  }

  // ===========================================================================
  // CROSS JOIN
  // ===========================================================================

  /**
   * Generates every possible employee/medical-plan combination.
   *
   * Example:
   * 10 employees × 3 plans = 30 combinations.
   *
   * SQL concept:
   * CROSS JOIN / Cartesian product
   */
  static async getEmployeeMedicalPlanCombinations(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      EMPLOYEE_NAME: string;
      MED_PLAN_ID: number;
      PLAN_NAME: string;
    }>
  > {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        P.MED_PLAN_ID,
        P.PLAN_NAME
      FROM EMPLOYEES E
      CROSS JOIN MED_PLANS P
      ORDER BY E.EMPLOYEE_ID, P.MED_PLAN_ID
    `;

    return Db2Connection.query(sql);
  }

  // ===========================================================================
  // MULTIPLE JOINS / BENEFITS
  // ===========================================================================

  /**
   * Retrieves employee organization information and medical benefit.
   *
   * SQL concepts:
   * INNER JOIN + LEFT JOIN
   */
  static async getEmployeeOrganizationAndMedicalBenefits(): Promise<EmployeeBenefitSummary[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        D.DEPARTMENT_NAME,
        M.FIRST_NAME || ' ' || M.LAST_NAME AS MANAGER_NAME,
        P.PLAN_NAME AS MEDICAL_PLAN
      FROM EMPLOYEES E
      INNER JOIN DEPARTMENTS D
        ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
      LEFT JOIN EMPLOYEES M
        ON E.MANAGER_ID = M.EMPLOYEE_ID
      LEFT JOIN EMPLOYEE_MED_ENROLLMENT EM
        ON E.EMPLOYEE_ID = EM.EMPLOYEE_ID
      LEFT JOIN MED_PLANS P
        ON EM.MED_PLAN_ID = P.MED_PLAN_ID
      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query<EmployeeBenefitSummary>(sql);
  }

  /**
   * Retrieves complete Medical, Dental and Vision benefits for employees.
   *
   * SQL concepts:
   * Multiple LEFT JOINs
   */
  static async getEmployeeCompleteBenefits(): Promise<EmployeeBenefitSummary[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        MP.PLAN_NAME AS MEDICAL_PLAN,
        DP.PLAN_NAME AS DENTAL_PLAN,
        VP.PLAN_NAME AS VISION_PLAN
      FROM EMPLOYEES E

      LEFT JOIN EMPLOYEE_MED_ENROLLMENT EM
        ON E.EMPLOYEE_ID = EM.EMPLOYEE_ID
        AND EM.ENROLLMENT_STATUS = 'ACTIVE'

      LEFT JOIN MED_PLANS MP
        ON EM.MED_PLAN_ID = MP.MED_PLAN_ID

      LEFT JOIN EMPLOYEE_DEN_ENROLLMENT ED
        ON E.EMPLOYEE_ID = ED.EMPLOYEE_ID
        AND ED.ENROLLMENT_STATUS = 'ACTIVE'

      LEFT JOIN DEN_PLANS DP
        ON ED.DEN_PLAN_ID = DP.DEN_PLAN_ID

      LEFT JOIN EMPLOYEE_VIS_ENROLLMENT EV
        ON E.EMPLOYEE_ID = EV.EMPLOYEE_ID
        AND EV.ENROLLMENT_STATUS = 'ACTIVE'

      LEFT JOIN VIS_PLANS VP
        ON EV.VIS_PLAN_ID = VP.VIS_PLAN_ID

      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query<EmployeeBenefitSummary>(sql);
  }

  // ===========================================================================
  // SUBQUERIES
  // ===========================================================================

  /**
   * Retrieves employees whose salary is greater than the company average.
   *
   * Example:
   * Employee salary > average salary of all employees.
   *
   * SQL concept:
   * Scalar subquery
   */
  static async getEmployeesAboveAverageSalary(): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY
      FROM EMPLOYEES
      WHERE SALARY > (
        SELECT AVG(SALARY)
        FROM EMPLOYEES
      )
      ORDER BY SALARY DESC
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Retrieves employees whose salary is greater than their department average.
   *
   * SQL concept:
   * Correlated subquery
   */
  static async getEmployeesAboveDepartmentAverageSalary(): Promise<Employee[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.LAST_NAME,
        E.DEPARTMENT_ID,
        E.SALARY
      FROM EMPLOYEES E
      WHERE E.SALARY > (
        SELECT AVG(E2.SALARY)
        FROM EMPLOYEES E2
        WHERE E2.DEPARTMENT_ID = E.DEPARTMENT_ID
      )
      ORDER BY E.DEPARTMENT_ID, E.SALARY DESC
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Retrieves employees who have at least one dependent.
   *
   * Example:
   * Employee 1 has Priya and Aarav as dependents.
   *
   * SQL concept:
   * EXISTS subquery
   *
   * The EXISTS condition returns TRUE when at least one
   * matching dependent exists for the employee.
   */
  static async getEmployeesHavingDependentsUsingExists(): Promise<Employee[]> {
    const sql = `
    SELECT
      E.EMPLOYEE_ID,
      E.EMPLOYEE_CODE,
      E.FIRST_NAME,
      E.LAST_NAME,
      E.EMAIL,
      E.EMPLOYMENT_STATUS,
      E.JOB_TITLE,
      E.SALARY
    FROM EMPLOYEES E
    WHERE EXISTS (
      SELECT 1
      FROM DEPENDENTS D
      WHERE D.EMPLOYEE_ID = E.EMPLOYEE_ID
    )
    ORDER BY E.EMPLOYEE_ID
  `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Retrieves employees who have at least one dependent.
   *
   * SQL concept:
   * EXISTS subquery
   */
  static async getEmployeesWithMultipleDependents(
    minimumDependents: number = 2,
  ): Promise<EmployeeDependentCount[]> {
    const sql = `
    SELECT
      E.EMPLOYEE_ID,
      E.FIRST_NAME,
      E.LAST_NAME,
      COUNT(D.DEPENDENT_ID) AS DEPENDENT_COUNT
    FROM EMPLOYEES E
    INNER JOIN DEPENDENTS D
      ON E.EMPLOYEE_ID = D.EMPLOYEE_ID
    GROUP BY
      E.EMPLOYEE_ID,
      E.FIRST_NAME,
      E.LAST_NAME
    HAVING COUNT(D.DEPENDENT_ID) >= ?
    ORDER BY DEPENDENT_COUNT DESC
  `;

    return Db2Connection.query<EmployeeDependentCount>(sql, [minimumDependents]);
  }

  /**
   * Retrieves employees who have no dependents.
   *
   * SQL concept:
   * NOT EXISTS
   */
  static async getEmployeesWithoutDependentsUsingNotExists(): Promise<Employee[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.LAST_NAME
      FROM EMPLOYEES E
      WHERE NOT EXISTS (
        SELECT 1
        FROM DEPENDENTS D
        WHERE D.EMPLOYEE_ID = E.EMPLOYEE_ID
      )
      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Retrieves employees enrolled in a specific medical plan.
   *
   * Example:
   * planCode = 'MED_PREMIUM'
   *
   * SQL concept:
   * IN subquery
   */
  static async getEmployeesByMedicalPlanCode(planCode: string): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL
      FROM EMPLOYEES
      WHERE EMPLOYEE_ID IN (
        SELECT EM.EMPLOYEE_ID
        FROM EMPLOYEE_MED_ENROLLMENT EM
        INNER JOIN MED_PLANS MP
          ON EM.MED_PLAN_ID = MP.MED_PLAN_ID
        WHERE MP.PLAN_CODE = ?
      )
      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql, [planCode]);
  }

  /**
   * Retrieves employees whose salary is greater than every salary
   * in a specified department.
   *
   * SQL concept:
   * ALL subquery
   */
  static async getEmployeesPaidMoreThanEveryEmployeeInDepartment(
    departmentId: number,
  ): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY
      FROM EMPLOYEES
      WHERE SALARY > ALL (
        SELECT SALARY
        FROM EMPLOYEES
        WHERE DEPARTMENT_ID = ?
      )
      ORDER BY SALARY DESC
    `;

    return Db2Connection.query<Employee>(sql, [departmentId]);
  }

  // ===========================================================================
  // DEPENDENTS / AGGREGATION
  // ===========================================================================

  /**
   * Returns each employee together with their dependent count.
   *
   * Example:
   * Raj Kumar → 2 dependents
   *
   * SQL concepts:
   * LEFT JOIN + COUNT + GROUP BY
   */
  static async getEmployeeDependentCounts(): Promise<EmployeeDependentSummary[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        COUNT(D.DEPENDENT_ID) AS DEPENDENT_COUNT
      FROM EMPLOYEES E
      LEFT JOIN DEPENDENTS D
        ON E.EMPLOYEE_ID = D.EMPLOYEE_ID
      GROUP BY
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.LAST_NAME
      ORDER BY DEPENDENT_COUNT DESC
    `;

    return Db2Connection.query<EmployeeDependentSummary>(sql);
  }

  /**
   * Retrieves employees having at least the specified number of dependents.
   *
   * Example:
   * minimumDependents = 2
   *
   * SQL concept:
   * GROUP BY + HAVING
   */
  static async getEmployeesWithMinimumDependents(
    minimumDependents: number = 2,
  ): Promise<EmployeeDependentSummary[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        COUNT(D.DEPENDENT_ID) AS DEPENDENT_COUNT
      FROM EMPLOYEES E
      INNER JOIN DEPENDENTS D
        ON E.EMPLOYEE_ID = D.EMPLOYEE_ID
      GROUP BY
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.LAST_NAME
      HAVING COUNT(D.DEPENDENT_ID) >= ?
      ORDER BY DEPENDENT_COUNT DESC
    `;

    return Db2Connection.query<EmployeeDependentSummary>(sql, [minimumDependents]);
  }

  /**
   * Retrieves dependents who are students.
   *
   * Example:
   * IS_STUDENT = 'Y'
   *
   * SQL concept:
   * WHERE filtering
   */
  static async getStudentDependents(): Promise<
    Array<{
      DEPENDENT_ID: number;
      EMPLOYEE_ID: number;
      FIRST_NAME: string;
      LAST_NAME: string;
    }>
  > {
    const sql = `
      SELECT
        DEPENDENT_ID,
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME
      FROM DEPENDENTS
      WHERE IS_STUDENT = 'Y'
      ORDER BY EMPLOYEE_ID, LAST_NAME
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Retrieves employees with their spouse and child dependent counts.
   *
   * SQL concept:
   * Conditional aggregation using CASE
   */
  static async getEmployeeDependentTypeSummary(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      EMPLOYEE_NAME: string;
      SPOUSE_COUNT: number;
      CHILD_COUNT: number;
    }>
  > {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        SUM(
          CASE
            WHEN D.RELATIONSHIP = 'SPOUSE' THEN 1
            ELSE 0
          END
        ) AS SPOUSE_COUNT,
        SUM(
          CASE
            WHEN D.RELATIONSHIP = 'CHILD' THEN 1
            ELSE 0
          END
        ) AS CHILD_COUNT
      FROM EMPLOYEES E
      LEFT JOIN DEPENDENTS D
        ON E.EMPLOYEE_ID = D.EMPLOYEE_ID
      GROUP BY
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.LAST_NAME
      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query(sql);
  }

  // ===========================================================================
  // SET OPERATORS
  // ===========================================================================

  /**
   * Returns employees who have either medical or dental enrollment.
   *
   * Duplicate employee IDs are removed.
   *
   * SQL concept:
   * UNION
   */
  static async getEmployeesWithMedicalOrDentalBenefits(): Promise<Array<{ EMPLOYEE_ID: number }>> {
    const sql = `
      SELECT EMPLOYEE_ID
      FROM EMPLOYEE_MED_ENROLLMENT

      UNION

      SELECT EMPLOYEE_ID
      FROM EMPLOYEE_DEN_ENROLLMENT

      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query<{ EMPLOYEE_ID: number }>(sql);
  }

  /**
   * Returns employees enrolled in both medical and dental benefits.
   *
   * SQL concept:
   * INTERSECT
   */
  static async getEmployeesWithMedicalAndDentalBenefits(): Promise<Array<{ EMPLOYEE_ID: number }>> {
    const sql = `
      SELECT EMPLOYEE_ID
      FROM EMPLOYEE_MED_ENROLLMENT

      INTERSECT

      SELECT EMPLOYEE_ID
      FROM EMPLOYEE_DEN_ENROLLMENT

      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query<{ EMPLOYEE_ID: number }>(sql);
  }

  /**
   * Returns employees with medical coverage but without dental coverage.
   *
   * SQL concept:
   * EXCEPT
   */
  static async getEmployeesWithMedicalButWithoutDental(): Promise<Array<{ EMPLOYEE_ID: number }>> {
    const sql = `
      SELECT EMPLOYEE_ID
      FROM EMPLOYEE_MED_ENROLLMENT

      EXCEPT

      SELECT EMPLOYEE_ID
      FROM EMPLOYEE_DEN_ENROLLMENT

      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query<{ EMPLOYEE_ID: number }>(sql);
  }

  /**
   * Returns all medical and dental enrollment records including duplicates.
   *
   * SQL concept:
   * UNION ALL
   */
  static async getAllMedicalAndDentalEnrollmentRecords(): Promise<Array<{ EMPLOYEE_ID: number }>> {
    const sql = `
      SELECT EMPLOYEE_ID
      FROM EMPLOYEE_MED_ENROLLMENT

      UNION ALL

      SELECT EMPLOYEE_ID
      FROM EMPLOYEE_DEN_ENROLLMENT
    `;

    return Db2Connection.query<{ EMPLOYEE_ID: number }>(sql);
  }

  // ===========================================================================
  // DATE FUNCTIONS
  // ===========================================================================

  /**
   * Retrieves employees hired after a supplied date.
   *
   * Example:
   * hireDate = '2020-01-01'
   *
   * SQL concept:
   * Date comparison
   */
  static async getEmployeesHiredAfter(hireDate: string): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        HIRE_DATE
      FROM EMPLOYEES
      WHERE HIRE_DATE > ?
      ORDER BY HIRE_DATE
    `;

    return Db2Connection.query<Employee>(sql, [hireDate]);
  }

  /**
   * Retrieves employees hired within a date range.
   *
   * Example:
   * startDate = '2020-01-01'
   * endDate = '2024-12-31'
   *
   * SQL concept:
   * BETWEEN with DATE
   */
  static async getEmployeesHiredBetween(startDate: string, endDate: string): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        HIRE_DATE
      FROM EMPLOYEES
      WHERE HIRE_DATE BETWEEN ? AND ?
      ORDER BY HIRE_DATE
    `;

    return Db2Connection.query<Employee>(sql, [startDate, endDate]);
  }

  /**
   * Calculates employee age from DATE_OF_BIRTH.
   *
   * SQL concepts:
   * YEAR + MONTH + DAY + CASE
   */
  static async getEmployeeAges(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      FIRST_NAME: string;
      LAST_NAME: string;
      DATE_OF_BIRTH: Date;
      AGE: number;
    }>
  > {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        DATE_OF_BIRTH,
        YEAR(CURRENT DATE) - YEAR(DATE_OF_BIRTH)
        - CASE
            WHEN MONTH(CURRENT DATE) < MONTH(DATE_OF_BIRTH)
              OR (
                MONTH(CURRENT DATE) = MONTH(DATE_OF_BIRTH)
                AND DAY(CURRENT DATE) < DAY(DATE_OF_BIRTH)
              )
            THEN 1
            ELSE 0
          END AS AGE
      FROM EMPLOYEES
      WHERE DATE_OF_BIRTH IS NOT NULL
      ORDER BY AGE DESC
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Retrieves employees who are at least a supplied age.
   *
   * Example:
   * minimumAge = 50
   *
   * SQL concept:
   * Date arithmetic + WHERE
   */
  static async getEmployeesAtLeastAge(minimumAge: number): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        DATE_OF_BIRTH
      FROM EMPLOYEES
      WHERE DATE_OF_BIRTH <=
        (CURRENT DATE - ? YEARS)
      ORDER BY DATE_OF_BIRTH
    `;

    return Db2Connection.query<Employee>(sql, [minimumAge]);
  }

  // ===========================================================================
  // STRING FUNCTIONS
  // ===========================================================================

  /**
   * Returns employees with their full name generated in SQL.
   *
   * SQL concept:
   * String concatenation
   */
  static async getEmployeesWithFullName(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      FULL_NAME: string;
    }>
  > {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME || ' ' || LAST_NAME AS FULL_NAME
      FROM EMPLOYEES
      ORDER BY LAST_NAME, FIRST_NAME
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Returns employee names converted to uppercase.
   *
   * SQL concept:
   * UPPER
   */
  static async getEmployeeNamesInUpperCase(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      FIRST_NAME: string;
      LAST_NAME: string;
    }>
  > {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        UPPER(FIRST_NAME) AS FIRST_NAME,
        UPPER(LAST_NAME) AS LAST_NAME
      FROM EMPLOYEES
      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Searches employees by email domain.
   *
   * Example:
   * domain = 'demo.com'
   *
   * SQL concept:
   * LOCATE / LIKE
   */
  static async getEmployeesByEmailDomain(domain: string): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL
      FROM EMPLOYEES
      WHERE EMAIL LIKE ?
      ORDER BY EMAIL
    `;

    return Db2Connection.query<Employee>(sql, [`%${domain}`]);
  }

  // ===========================================================================
  // CTE
  // ===========================================================================

  /**
   * Returns department statistics using a Common Table Expression.
   *
   * SQL concept:
   * WITH / CTE
   */
  static async getDepartmentEmployeeCountsUsingCte(): Promise<
    Array<{
      DEPARTMENT_ID: number;
      DEPARTMENT_NAME: string;
      EMPLOYEE_COUNT: number;
      AVG_SALARY: number;
    }>
  > {
    const sql = `
      WITH DEPARTMENT_STATS AS (
        SELECT
          DEPARTMENT_ID,
          COUNT(*) AS EMPLOYEE_COUNT,
          AVG(SALARY) AS AVG_SALARY
        FROM EMPLOYEES
        GROUP BY DEPARTMENT_ID
      )
      SELECT
        D.DEPARTMENT_ID,
        D.DEPARTMENT_NAME,
        S.EMPLOYEE_COUNT,
        S.AVG_SALARY
      FROM DEPARTMENT_STATS S
      INNER JOIN DEPARTMENTS D
        ON S.DEPARTMENT_ID = D.DEPARTMENT_ID
      ORDER BY S.EMPLOYEE_COUNT DESC
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Returns the highest-paid employee from each department using a CTE.
   *
   * SQL concept:
   * CTE + ROW_NUMBER
   */
  static async getHighestPaidEmployeePerDepartmentUsingCte(): Promise<
    Array<{
      DEPARTMENT_ID: number;
      EMPLOYEE_ID: number;
      EMPLOYEE_NAME: string;
      SALARY: number;
    }>
  > {
    const sql = `
      WITH RANKED_EMPLOYEES AS (
        SELECT
          EMPLOYEE_ID,
          DEPARTMENT_ID,
          FIRST_NAME || ' ' || LAST_NAME AS EMPLOYEE_NAME,
          SALARY,
          ROW_NUMBER() OVER (
            PARTITION BY DEPARTMENT_ID
            ORDER BY SALARY DESC
          ) AS RN
        FROM EMPLOYEES
      )
      SELECT
        DEPARTMENT_ID,
        EMPLOYEE_ID,
        EMPLOYEE_NAME,
        SALARY
      FROM RANKED_EMPLOYEES
      WHERE RN = 1
      ORDER BY DEPARTMENT_ID
    `;

    return Db2Connection.query(sql);
  }

  // ===========================================================================
  // WINDOW FUNCTIONS
  // ===========================================================================

  /**
   * Ranks employees by salary across the organization.
   *
   * SQL concept:
   * RANK() window function
   */
  static async getEmployeesRankedBySalary(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      FIRST_NAME: string;
      LAST_NAME: string;
      SALARY: number;
      SALARY_RANK: number;
    }>
  > {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY,
        RANK() OVER (
          ORDER BY SALARY DESC
        ) AS SALARY_RANK
      FROM EMPLOYEES
      ORDER BY SALARY_RANK
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Ranks employees by salary within each department.
   *
   * SQL concept:
   * PARTITION BY + RANK
   */
  static async getEmployeesRankedByDepartmentSalary(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      FIRST_NAME: string;
      LAST_NAME: string;
      DEPARTMENT_ID: number;
      SALARY: number;
      DEPARTMENT_SALARY_RANK: number;
    }>
  > {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        DEPARTMENT_ID,
        SALARY,
        RANK() OVER (
          PARTITION BY DEPARTMENT_ID
          ORDER BY SALARY DESC
        ) AS DEPARTMENT_SALARY_RANK
      FROM EMPLOYEES
      ORDER BY DEPARTMENT_ID, DEPARTMENT_SALARY_RANK
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Assigns a unique row number to employees based on salary.
   *
   * SQL concept:
   * ROW_NUMBER()
   */
  static async getEmployeesWithSalaryRowNumber(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      FIRST_NAME: string;
      SALARY: number;
      ROW_NUMBER: number;
    }>
  > {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        SALARY,
        ROW_NUMBER() OVER (
          ORDER BY SALARY DESC
        ) AS ROW_NUMBER
      FROM EMPLOYEES
      ORDER BY ROW_NUMBER
    `;

    return Db2Connection.query(sql);
  }

  /**
   * Calculates a running total of employee salaries.
   *
   * SQL concept:
   * SUM() OVER()
   */
  static async getRunningEmployeeSalaryTotal(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      FIRST_NAME: string;
      SALARY: number;
      RUNNING_SALARY_TOTAL: number;
    }>
  > {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        SALARY,
        SUM(SALARY) OVER (
          ORDER BY EMPLOYEE_ID
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS RUNNING_SALARY_TOTAL
      FROM EMPLOYEES
      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query(sql);
  }

  // ===========================================================================
  // BENEFITS VALIDATION
  // ===========================================================================

  /**
   * Finds active employees without active medical coverage.
   *
   * SQL concepts:
   * LEFT JOIN + NULL filtering
   */
  static async getActiveEmployeesWithoutMedicalCoverage(): Promise<Employee[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.LAST_NAME,
        E.EMPLOYMENT_STATUS
      FROM EMPLOYEES E
      LEFT JOIN EMPLOYEE_MED_ENROLLMENT EM
        ON E.EMPLOYEE_ID = EM.EMPLOYEE_ID
        AND EM.ENROLLMENT_STATUS = 'ACTIVE'
      WHERE E.EMPLOYMENT_STATUS = 'ACTIVE'
        AND EM.ENROLLMENT_ID IS NULL
      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Finds employees enrolled in Medical, Dental and Vision.
   *
   * SQL concept:
   * Multiple INNER JOINs
   */
  static async getEmployeesWithCompleteHealthBenefits(): Promise<EmployeeBenefitSummary[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
        MP.PLAN_NAME AS MEDICAL_PLAN,
        DP.PLAN_NAME AS DENTAL_PLAN,
        VP.PLAN_NAME AS VISION_PLAN
      FROM EMPLOYEES E

      INNER JOIN EMPLOYEE_MED_ENROLLMENT EM
        ON E.EMPLOYEE_ID = EM.EMPLOYEE_ID
        AND EM.ENROLLMENT_STATUS = 'ACTIVE'

      INNER JOIN MED_PLANS MP
        ON EM.MED_PLAN_ID = MP.MED_PLAN_ID

      INNER JOIN EMPLOYEE_DEN_ENROLLMENT ED
        ON E.EMPLOYEE_ID = ED.EMPLOYEE_ID
        AND ED.ENROLLMENT_STATUS = 'ACTIVE'

      INNER JOIN DEN_PLANS DP
        ON ED.DEN_PLAN_ID = DP.DEN_PLAN_ID

      INNER JOIN EMPLOYEE_VIS_ENROLLMENT EV
        ON E.EMPLOYEE_ID = EV.EMPLOYEE_ID
        AND EV.ENROLLMENT_STATUS = 'ACTIVE'

      INNER JOIN VIS_PLANS VP
        ON EV.VIS_PLAN_ID = VP.VIS_PLAN_ID

      ORDER BY E.EMPLOYEE_ID
    `;

    return Db2Connection.query<EmployeeBenefitSummary>(sql);
  }

  /**
   * Calculates the total employee monthly premium across Medical,
   * Dental and Vision plans.
   *
   * SQL concept:
   * Multiple LEFT JOINs + COALESCE + arithmetic
   */
  static async getEmployeeTotalBenefitPremiums(): Promise<
    Array<{
      EMPLOYEE_ID: number;
      EMPLOYEE_NAME: string;
      TOTAL_EMPLOYEE_PREMIUM: number;
    }>
  > {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,

        COALESCE(MP.EMPLOYEE_PREMIUM, 0)
        + COALESCE(DP.EMPLOYEE_PREMIUM, 0)
        + COALESCE(VP.EMPLOYEE_PREMIUM, 0)
        AS TOTAL_EMPLOYEE_PREMIUM

      FROM EMPLOYEES E

      LEFT JOIN EMPLOYEE_MED_ENROLLMENT EM
        ON E.EMPLOYEE_ID = EM.EMPLOYEE_ID
        AND EM.ENROLLMENT_STATUS = 'ACTIVE'

      LEFT JOIN MED_PLANS MP
        ON EM.MED_PLAN_ID = MP.MED_PLAN_ID

      LEFT JOIN EMPLOYEE_DEN_ENROLLMENT ED
        ON E.EMPLOYEE_ID = ED.EMPLOYEE_ID
        AND ED.ENROLLMENT_STATUS = 'ACTIVE'

      LEFT JOIN DEN_PLANS DP
        ON ED.DEN_PLAN_ID = DP.DEN_PLAN_ID

      LEFT JOIN EMPLOYEE_VIS_ENROLLMENT EV
        ON E.EMPLOYEE_ID = EV.EMPLOYEE_ID
        AND EV.ENROLLMENT_STATUS = 'ACTIVE'

      LEFT JOIN VIS_PLANS VP
        ON EV.VIS_PLAN_ID = VP.VIS_PLAN_ID

      ORDER BY TOTAL_EMPLOYEE_PREMIUM DESC
    `;

    return Db2Connection.query(sql);
  }

  // ===========================================================================
  // 401K BUSINESS RULE
  // ===========================================================================

  /**
   * Validates 401K catch-up contribution eligibility.
   *
   * Business rule:
   *
   * Age < 50
   *   → BASIC ONLY
   *
   * Age >= 50
   *   → BASIC + CATCH-UP
   *
   * SQL concepts:
   * JOIN + CASE + date calculation
   */
  static async get401KCatchupEligibility(): Promise<Employee401KCatchupEligibility[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.LAST_NAME,
        E.DATE_OF_BIRTH,

        YEAR(CURRENT DATE) - YEAR(E.DATE_OF_BIRTH)
        - CASE
            WHEN MONTH(CURRENT DATE) < MONTH(E.DATE_OF_BIRTH)
              OR (
                MONTH(CURRENT DATE) = MONTH(E.DATE_OF_BIRTH)
                AND DAY(CURRENT DATE) < DAY(E.DATE_OF_BIRTH)
              )
            THEN 1
            ELSE 0
          END AS AGE,

        P.CATCHUP_MIN_AGE,

        R.BASIC_CONTRIBUTION_AMOUNT,
        R.CATCHUP_CONTRIBUTION_AMOUNT,
        R.TOTAL_CONTRIBUTION_AMOUNT,

        CASE
          WHEN
            (
              YEAR(CURRENT DATE) - YEAR(E.DATE_OF_BIRTH)
              - CASE
                  WHEN MONTH(CURRENT DATE) < MONTH(E.DATE_OF_BIRTH)
                    OR (
                      MONTH(CURRENT DATE) = MONTH(E.DATE_OF_BIRTH)
                      AND DAY(CURRENT DATE) < DAY(E.DATE_OF_BIRTH)
                    )
                  THEN 1
                  ELSE 0
                END
            ) >= P.CATCHUP_MIN_AGE
          THEN 'BASIC + CATCHUP'
          ELSE 'BASIC ONLY'
        END AS EXPECTED_CONTRIBUTION_TYPE

      FROM EMPLOYEES E

      INNER JOIN EMPLOYEE_401L_ENROLLMENT R
        ON E.EMPLOYEE_ID = R.EMPLOYEE_ID

      INNER JOIN PLANS_401L P
        ON R.PLAN_401L_ID = P.PLAN_401L_ID

      ORDER BY AGE DESC
    `;

    return Db2Connection.query<Employee401KCatchupEligibility>(sql);
  }

  /**
   * Finds employees violating the 401K catch-up contribution rule.
   *
   * Expected:
   * Zero records when all employees follow the business rule.
   *
   * Business rule:
   * Age >= 50 → Catch-up contribution required.
   * Age < 50  → Catch-up contribution must be zero.
   *
   * SQL concept:
   * Business-rule validation + CASE + WHERE
   */
  static async get401KContributionRuleViolations(): Promise<Employee401KCatchupEligibility[]> {
    const sql = `
      SELECT
        E.EMPLOYEE_ID,
        E.FIRST_NAME,
        E.LAST_NAME,
        E.DATE_OF_BIRTH,

        YEAR(CURRENT DATE) - YEAR(E.DATE_OF_BIRTH)
        - CASE
            WHEN MONTH(CURRENT DATE) < MONTH(E.DATE_OF_BIRTH)
              OR (
                MONTH(CURRENT DATE) = MONTH(E.DATE_OF_BIRTH)
                AND DAY(CURRENT DATE) < DAY(E.DATE_OF_BIRTH)
              )
            THEN 1
            ELSE 0
          END AS AGE,

        P.CATCHUP_MIN_AGE,
        R.BASIC_CONTRIBUTION_AMOUNT,
        R.CATCHUP_CONTRIBUTION_AMOUNT,
        R.TOTAL_CONTRIBUTION_AMOUNT,

        CASE
          WHEN
            (
              YEAR(CURRENT DATE) - YEAR(E.DATE_OF_BIRTH)
              - CASE
                  WHEN MONTH(CURRENT DATE) < MONTH(E.DATE_OF_BIRTH)
                    OR (
                      MONTH(CURRENT DATE) = MONTH(E.DATE_OF_BIRTH)
                      AND DAY(CURRENT DATE) < DAY(E.DATE_OF_BIRTH)
                    )
                  THEN 1
                  ELSE 0
                END
            ) >= P.CATCHUP_MIN_AGE
          THEN 'BASIC + CATCHUP'
          ELSE 'BASIC ONLY'
        END AS EXPECTED_CONTRIBUTION_TYPE

      FROM EMPLOYEES E

      INNER JOIN EMPLOYEE_401L_ENROLLMENT R
        ON E.EMPLOYEE_ID = R.EMPLOYEE_ID

      INNER JOIN PLANS_401L P
        ON R.PLAN_401L_ID = P.PLAN_401L_ID

      WHERE
        (
          (
            YEAR(CURRENT DATE) - YEAR(E.DATE_OF_BIRTH)
            - CASE
                WHEN MONTH(CURRENT DATE) < MONTH(E.DATE_OF_BIRTH)
                  OR (
                    MONTH(CURRENT DATE) = MONTH(E.DATE_OF_BIRTH)
                    AND DAY(CURRENT DATE) < DAY(E.DATE_OF_BIRTH)
                  )
                THEN 1
                ELSE 0
              END
          ) >= P.CATCHUP_MIN_AGE
          AND R.CATCHUP_CONTRIBUTION_AMOUNT = 0
        )
        OR
        (
          (
            YEAR(CURRENT DATE) - YEAR(E.DATE_OF_BIRTH)
            - CASE
                WHEN MONTH(CURRENT DATE) < MONTH(E.DATE_OF_BIRTH)
                  OR (
                    MONTH(CURRENT DATE) = MONTH(E.DATE_OF_BIRTH)
                    AND DAY(CURRENT DATE) < DAY(E.DATE_OF_BIRTH)
                  )
                THEN 1
                ELSE 0
              END
          ) < P.CATCHUP_MIN_AGE
          AND R.CATCHUP_CONTRIBUTION_AMOUNT > 0
        )
    `;

    return Db2Connection.query<Employee401KCatchupEligibility>(sql);
  }

  // ===========================================================================
  // DATA QUALITY / VALIDATION
  // ===========================================================================

  /**
   * Finds active employees with missing email addresses.
   *
   * SQL concept:
   * Data-quality validation + IS NULL
   */
  static async getActiveEmployeesWithMissingEmail(): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        EMPLOYEE_CODE,
        FIRST_NAME,
        LAST_NAME,
        EMAIL
      FROM EMPLOYEES
      WHERE EMPLOYMENT_STATUS = 'ACTIVE'
        AND EMAIL IS NULL
      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Finds employees with invalid salary values.
   *
   * Business validation:
   * Salary should not be negative.
   *
   * SQL concept:
   * Data validation using comparison operator
   */
  static async getEmployeesWithInvalidSalary(): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        SALARY
      FROM EMPLOYEES
      WHERE SALARY < 0
      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql);
  }

  /**
   * Finds employees whose termination date occurs before their hire date.
   *
   * SQL concept:
   * Date validation
   */
  static async getEmployeesWithInvalidEmploymentDates(): Promise<Employee[]> {
    const sql = `
      SELECT
        EMPLOYEE_ID,
        FIRST_NAME,
        LAST_NAME,
        HIRE_DATE,
        TERMINATION_DATE
      FROM EMPLOYEES
      WHERE TERMINATION_DATE IS NOT NULL
        AND HIRE_DATE > TERMINATION_DATE
      ORDER BY EMPLOYEE_ID
    `;

    return Db2Connection.query<Employee>(sql);
  }
}
