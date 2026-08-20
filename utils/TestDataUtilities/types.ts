export type MaritalStatus = 'M' | 'S';

export type DependentRelation = 'SPOUSE' | 'CHILD';

export type Scenario = 'MARRIED' | 'SINGLE' | '401K_CATCH_UP' | '401K_NON_CATCH_UP';

export interface EmployeeData {
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
}

export interface DependentData {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  relation: DependentRelation;
}

export interface EmployeeScenarioData {
  scenario: Scenario;
  employee: EmployeeData;
  dependents: DependentData[];
}
