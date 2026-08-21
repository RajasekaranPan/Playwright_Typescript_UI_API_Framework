export interface Plan401K {
  PLAN_401K_ID: number;
  PLAN_CODE: string;
  PLAN_NAME: string;
  DESCRIPTION?: string;
  BASIC_CONTRIBUTION_PERCENT?: number;
  CATCHUP_MIN_AGE: number;
  CATCHUP_CONTRIBUTION_PERCENT?: number;
  ANNUAL_LIMIT?: number;
  CATCHUP_ANNUAL_LIMIT?: number;
  STATUS: string;
  EFFECTIVE_DATE: Date;
  END_DATE?: Date;
}
