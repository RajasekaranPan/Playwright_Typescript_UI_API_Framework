export interface MedPlan {
  MED_PLAN_ID: number;
  PLAN_CODE: string;
  PLAN_NAME: string;
  PLAN_TYPE?: string;
  COVERAGE_LEVEL?: string;
  EMPLOYEE_PREMIUM?: number;
  EMPLOYER_PREMIUM?: number;
  DEDUCTIBLE?: number;
  OUT_OF_POCKET_MAX?: number;
  STATUS: string;
  EFFECTIVE_DATE: Date;
  END_DATE?: Date;
}
