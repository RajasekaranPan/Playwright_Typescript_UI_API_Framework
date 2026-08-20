import { EmployeeScenarioData, Scenario } from './types';

import { EmployeeDataProvider } from './EmployeeDataProvider';

import { DependentDataFactory } from './DependentDataFactory';

export class ScenarioDataFactory {
  // Rule 1
  public static createMarriedScenario(): EmployeeScenarioData {
    const employee = this.findEmployeeForMarriedScenario();

    return {
      scenario: 'MARRIED',
      employee,
      dependents: [DependentDataFactory.createSpouse(employee)],
    };
  }

  // Rule 2
  public static createSingleScenario(): EmployeeScenarioData {
    const employee = this.findEmployeeForSingleScenario();

    return {
      scenario: 'SINGLE',
      employee,
      dependents: [],
    };
  }

  // Rule 3
  public static create401kCatchUpScenario(): EmployeeScenarioData {
    const employee = this.findEmployeeFor401kCatchUp();

    const dependents =
      employee.maritalStatus === 'M' ? [DependentDataFactory.createSpouse(employee)] : [];

    return {
      scenario: '401K_CATCH_UP',
      employee,
      dependents,
    };
  }

  // Rule 4
  public static create401kNonCatchUpScenario(): EmployeeScenarioData {
    const employee = this.findEmployeeFor401kNonCatchUp();

    const dependents =
      employee.maritalStatus === 'M' ? [DependentDataFactory.createSpouse(employee)] : [];

    return {
      scenario: '401K_NON_CATCH_UP',
      employee,
      dependents,
    };
  }

  // --------------------------------------------------
  // Employee selection
  // --------------------------------------------------

  private static findEmployeeForMarriedScenario() {
    const employees = EmployeeDataProvider.getEmployees();

    const matchingEmployees = employees.filter(
      (employee) => employee.maritalStatus === 'M' && this.calculateAge(employee.dateOfBirth) >= 18,
    );

    if (matchingEmployees.length === 0) {
      throw new Error('No employee satisfies married scenario: age >= 18 and M');
    }

    return this.randomEmployee(matchingEmployees);
  }

  private static findEmployeeForSingleScenario() {
    const employees = EmployeeDataProvider.getEmployees();

    const matchingEmployees = employees.filter(
      (employee) => employee.maritalStatus === 'S' && this.calculateAge(employee.dateOfBirth) < 18,
    );

    if (matchingEmployees.length === 0) {
      throw new Error('No employee satisfies single scenario: age < 18 and S');
    }

    return this.randomEmployee(matchingEmployees);
  }

  private static findEmployeeFor401kCatchUp() {
    const employees = EmployeeDataProvider.getEmployees();

    const matchingEmployees = employees.filter(
      (employee) => this.calculateAge(employee.dateOfBirth) > 50,
    );

    if (matchingEmployees.length === 0) {
      throw new Error('No employee satisfies 401(k) catch-up rule: age > 50');
    }

    return this.randomEmployee(matchingEmployees);
  }

  private static findEmployeeFor401kNonCatchUp() {
    const employees = EmployeeDataProvider.getEmployees();

    const matchingEmployees = employees.filter((employee) => {
      const age = this.calculateAge(employee.dateOfBirth);

      return age > 18 && age < 50;
    });

    if (matchingEmployees.length === 0) {
      throw new Error('No employee satisfies 401(k) non-catch-up rule: age > 18 and age < 50');
    }

    return this.randomEmployee(matchingEmployees);
  }

  // --------------------------------------------------
  // Utility methods
  // --------------------------------------------------

  private static randomEmployee<T>(employees: T[]): T {
    const index = Math.floor(Math.random() * employees.length);

    return employees[index];
  }

  private static calculateAge(dateOfBirth: string): number {
    const today = new Date();

    const dob = new Date(dateOfBirth);

    let age = today.getFullYear() - dob.getFullYear();

    const monthDifference = today.getMonth() - dob.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }
}
