export interface Manager {
  MANAGER_ID: number;
  MANAGER_CODE: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  PHONE?: string;
  DEPARTMENT_ID: number;
  JOB_TITLE?: string;
  STATUS: string;
  HIRE_DATE?: Date;
  CREATED_DATE: Date;
  UPDATED_DATE: Date;
}
