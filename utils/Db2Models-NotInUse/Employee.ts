export interface Employee {
  EMPLOYEE_ID: number;
  EMPLOYEE_CODE: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  PHONE?: string;
  DATE_OF_BIRTH?: Date;
  GENDER?: string;
  HIRE_DATE?: Date;
  TERMINATION_DATE?: Date;
  EMPLOYMENT_TYPE?: string;
  EMPLOYMENT_STATUS: string;
  JOB_TITLE?: string;
  SALARY?: number;
  DEPARTMENT_ID?: number;
  MANAGER_ID?: number;
  WORK_LOCATION?: string;
  COUNTRY?: string;
  STATE?: string;
  CITY?: string;
  CREATED_DATE: Date;
  UPDATED_DATE: Date;
}
