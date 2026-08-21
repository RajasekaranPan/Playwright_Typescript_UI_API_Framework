// ============================================================================
// DEPARTMENT
// ============================================================================

export interface Department {
  DEPARTMENT_ID: number;
  DEPARTMENT_CODE: string;
  DEPARTMENT_NAME: string;
  DESCRIPTION?: string;
  LOCATION?: string;
  COST_CENTER?: string;
  STATUS: string;
  CREATED_DATE?: Date;
  UPDATED_DATE?: Date;
}

// ============================================================================
// MANAGER
// ============================================================================

export interface Manager {
  MANAGER_ID: number;
  MANAGER_CODE: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  PHONE?: string;
  JOB_TITLE?: string;
  DEPARTMENT_ID: number;
  STATUS: string;
}

// ============================================================================
// EMPLOYEE
// ============================================================================

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
  CREATED_DATE?: Date;
  UPDATED_DATE?: Date;
}

// ============================================================================
// DEPENDENT
// ============================================================================

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
}

// ============================================================================
// MEDICAL PLAN
// ============================================================================

export interface MedPlan {
  MED_PLAN_ID: number;
  PLAN_CODE: string;
  PLAN_NAME: string;
  PLAN_TYPE?: string;
  EMPLOYEE_PREMIUM?: number;
  EMPLOYER_PREMIUM?: number;
  ANNUAL_DEDUCTIBLE?: number;
  OUT_OF_POCKET_MAX?: number;
  STATUS: string;
}

// ============================================================================
// DENTAL PLAN
// ============================================================================

export interface DenPlan {
  DEN_PLAN_ID: number;
  PLAN_CODE: string;
  PLAN_NAME: string;
  PLAN_TYPE?: string;
  EMPLOYEE_PREMIUM?: number;
  EMPLOYER_PREMIUM?: number;
  ANNUAL_DEDUCTIBLE?: number;
  ANNUAL_MAXIMUM?: number;
  STATUS: string;
}

// ============================================================================
// VISION PLAN
// ============================================================================

export interface VisPlan {
  VIS_PLAN_ID: number;
  PLAN_CODE: string;
  PLAN_NAME: string;
  PLAN_TYPE?: string;
  EMPLOYEE_PREMIUM?: number;
  EMPLOYER_PREMIUM?: number;
  EXAM_COPAY?: number;
  LENS_COPAY?: number;
  FRAME_ALLOWANCE?: number;
  STATUS: string;
}

// ============================================================================
// 401K PLAN
// ============================================================================

export interface Plan401K {
  PLAN_401K_ID: number;
  PLAN_CODE: string;
  PLAN_NAME: string;
  BASIC_CONTRIBUTION_PERCENT?: number;
  CATCHUP_MIN_AGE: number;
  CATCHUP_CONTRIBUTION_PERCENT?: number;
  STATUS: string;
}

// ============================================================================
// EMPLOYEE 401K ENROLLMENT
// ============================================================================

export interface Employee401KEnrollment {
  ENROLLMENT_ID: number;
  EMPLOYEE_ID: number;
  PLAN_401K_ID: number;
  BASIC_CONTRIBUTION_AMOUNT: number;
  CATCHUP_CONTRIBUTION_AMOUNT: number;
  TOTAL_CONTRIBUTION_AMOUNT: number;
  ENROLLMENT_STATUS: string;
}

// ============================================================================
// QUERY RESULT MODELS
// ============================================================================

export interface EmployeeUnderManager {
  EMPLOYEE_ID: number;
  EMPLOYEE_NAME: string;
  MANAGER_NAME: string;
  DEPARTMENT_NAME: string;
  SALARY: number;
}

export interface EmployeeDepartment {
  EMPLOYEE_ID: number;
  EMPLOYEE_NAME: string;
  DEPARTMENT_NAME: string;
  SALARY: number;
}

export interface EmployeeDependentSummary {
  EMPLOYEE_ID: number;
  EMPLOYEE_NAME: string;
  DEPENDENT_COUNT: number;
}

export interface DepartmentEmployeeStatistics {
  DEPARTMENT_ID: number;
  EMPLOYEE_COUNT: number;
  AVG_SALARY: number;
}

export interface EmployeeSalaryStatistics {
  EMPLOYEE_COUNT: number;
  MIN_SALARY: number;
  MAX_SALARY: number;
  AVG_SALARY: number;
  TOTAL_SALARY: number;
}

export interface EmployeeSalaryBand {
  EMPLOYEE_ID: number;
  FIRST_NAME: string;
  SALARY: number;
  SALARY_BAND: string;
}

export interface EmployeeManager {
  EMPLOYEE_ID: number;
  EMPLOYEE_NAME: string;
  MANAGER_NAME: string;
}

export interface EmployeeBenefitSummary {
  EMPLOYEE_ID: number;
  EMPLOYEE_NAME: string;
  MEDICAL_PLAN?: string;
  DENTAL_PLAN?: string;
  VISION_PLAN?: string;
}

export interface Employee401KCatchupEligibility {
  EMPLOYEE_ID: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  DATE_OF_BIRTH: Date;
  AGE: number;
  CATCHUP_MIN_AGE: number;
  BASIC_CONTRIBUTION_AMOUNT: number;
  CATCHUP_CONTRIBUTION_AMOUNT: number;
  TOTAL_CONTRIBUTION_AMOUNT: number;
  EXPECTED_CONTRIBUTION_TYPE: string;
}

export interface EmployeeDependentCount {
  EMPLOYEE_ID: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  DEPENDENT_COUNT: number;
}
