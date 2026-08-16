import * as XLSX from 'xlsx';
import {
    EmployeeData,
    MaritalStatus
} from './types';
import { DataPath, DataSheet } from '../../config/data-paths';

export class EmployeeDataProvider {

    private static readEmployees(): EmployeeData[] {

        const workbook =
            XLSX.readFile(DataPath.orangeHRM);

        const worksheet =
            workbook.Sheets[DataSheet.employee];

        if (!worksheet) {
            throw new Error(
                `Excel sheet '${DataSheet.employee}' not found`
            );
        }

        return XLSX.utils.sheet_to_json<EmployeeData>(
            worksheet,
            {
                defval: ''
            }
        );
    }

    public static getEmployees(): EmployeeData[] {

        return this.readEmployees();
    }

    public static getEmployeeById(
        employeeId: string
    ): EmployeeData {

        const employees =
            this.readEmployees();

        const employee =
            employees.find(
                emp => emp.employeeId === employeeId
            );

        if (!employee) {
            throw new Error(
                `Employee '${employeeId}' not found in Excel`
            );
        }

        return employee;
    }

    public static getEmployeeByMaritalStatus(
        maritalStatus: MaritalStatus
    ): EmployeeData {

        const employees =
            this.readEmployees();

        const matchingEmployees =
            employees.filter(
                emp =>
                    emp.maritalStatus === maritalStatus
            );

        if (matchingEmployees.length === 0) {
            throw new Error(
                `No employee found with marital status '${maritalStatus}'`
            );
        }

        return this.randomEmployee(
            matchingEmployees
        );
    }

    private static randomEmployee(
        employees: EmployeeData[]
    ): EmployeeData {

        const index =
            Math.floor(
                Math.random() * employees.length
            );

        return employees[index];
    }
}