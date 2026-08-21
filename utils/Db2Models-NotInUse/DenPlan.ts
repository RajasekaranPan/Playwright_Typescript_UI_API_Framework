export interface DenPlan {
  DEN_PLAN_ID: number;
  PLAN_CODE: string;
  PLAN_NAME: string;
  PLAN_TYPE?: string;
  COVERAGE_LEVEL?: string;
  EMPLOYEE_PREMIUM?: number;
  EMPLOYER_PREMIUM?: number;
  DEDUCTIBLE?: number;
  ANNUAL_MAXIMUM?: number;
  ORTHODONTIA_COVERAGE?: string;
  STATUS: string;
  EFFECTIVE_DATE: Date;
  END_DATE?: Date;
}
