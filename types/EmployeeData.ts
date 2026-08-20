export type MaritalStatus = 'M' | 'S';

export type DependentRelation = 'SPOUSE' | 'CHILD';

export interface PersonData {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
}

export interface DependentData extends PersonData {
  relation: DependentRelation;
}

export interface EmployeeData extends PersonData {
  address: string;
  maritalStatus: MaritalStatus;
  dependents: DependentData[];
}
