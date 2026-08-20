import { faker } from '@faker-js/faker';
import { DependentData, EmployeeData } from './types';

//The important thing here is that Faker is not blindly generating the spouse's DOB.
//We first determine an appropriate spouse age and then generate a DOB corresponding to that age.

export class DependentDataFactory {
  public static createSpouse(employee: EmployeeData): DependentData {
    const spouseAge = this.generateSpouseAge(this.calculateAge(employee.dateOfBirth));

    const dateOfBirth = this.generateDateOfBirthFromAge(spouseAge);

    return {
      firstName: faker.person.firstName(),

      middleName: faker.person.middleName(),

      lastName: employee.lastName,

      dateOfBirth,

      age: this.calculateAge(dateOfBirth),

      relation: 'SPOUSE',
    };
  }

  private static generateSpouseAge(employeeAge: number): number {
    const minimumAge = Math.max(18, employeeAge - 10);

    const maximumAge = employeeAge + 10;

    return faker.number.int({
      min: minimumAge,
      max: maximumAge,
    });
  }

  private static generateDateOfBirthFromAge(age: number): string {
    const today = new Date();

    const year = today.getFullYear() - age;

    const date = faker.date.between({
      from: new Date(year, 0, 1),
      to: new Date(year, 11, 31),
    });

    return date.toISOString().split('T')[0];
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
