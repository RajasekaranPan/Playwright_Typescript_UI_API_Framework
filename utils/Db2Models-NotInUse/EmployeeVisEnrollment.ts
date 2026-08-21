export interface EmployeeVisEnrollment {
  ENROLLMENT_ID: number;
  EMPLOYEE_ID: number;
  VIS_PLAN_ID: number;
  COVERAGE_LEVEL?: string;
  EMPLOYEE_PREMIUM?: number;
  ENROLLMENT_STATUS: string;
  EFFECTIVE_DATE: Date;
  END_DATE?: Date;
  CREATED_DATE?: Date;
  UPDATED_DATE?: Date;
}
