export interface Dependent {
  DEPENDENT_ID: number;
  EMPLOYEE_ID: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  RELATIONSHIP: string;
  DATE_OF_BIRTH?: Date;
  GENDER?: string;
  SSN_LAST4?: string;
  IS_STUDENT: string;
  IS_DISABLED: string;
  STATUS: string;
  CREATED_DATE?: Date;
  UPDATED_DATE?: Date;
}
