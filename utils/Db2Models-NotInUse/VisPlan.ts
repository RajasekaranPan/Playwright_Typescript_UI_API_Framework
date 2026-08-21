export interface VisPlan {
  VIS_PLAN_ID: number;
  PLAN_CODE: string;
  PLAN_NAME: string;
  PLAN_TYPE?: string;
  COVERAGE_LEVEL?: string;
  EMPLOYEE_PREMIUM?: number;
  EMPLOYER_PREMIUM?: number;
  EXAM_COVERAGE?: string;
  FRAME_ALLOWANCE?: number;
  LENS_COVERAGE?: string;
  CONTACT_LENS_COVERAGE?: string;
  STATUS: string;
  EFFECTIVE_DATE: Date;
  END_DATE?: Date;
}
