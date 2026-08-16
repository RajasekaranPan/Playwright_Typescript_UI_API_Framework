import { Db2Connection } from './Db2Connection';

export class Db2Queries {

    static async getEmployeeById(employeeId: number) {

        const sql = `
            SELECT
                EMPLOYEE_ID,
                FIRST_NAME,
                LAST_NAME,
                EMAIL,
                STATUS
            FROM EMPLOYEE
            WHERE EMPLOYEE_ID = ?
        `;

        return await Db2Connection.query(sql, [employeeId]);
    }


    static async getEmployeeByEmail(email: string) {

        const sql = `
            SELECT
                EMPLOYEE_ID,
                FIRST_NAME,
                LAST_NAME,
                EMAIL,
                STATUS
            FROM EMPLOYEE
            WHERE EMAIL = ?
        `;

        return await Db2Connection.query(sql, [email]);
    }


    static async getEmployeesUnderManager(
    managerId: number,
    department: string
) {

    const sql = `
        SELECT
            E.EMP_ID,
            E.EMP_NAME AS EMPLOYEE_NAME,
            M.EMP_NAME AS MANAGER_NAME,
            E.DEPARTMENT
        FROM EMPLOYEE E
        INNER JOIN EMPLOYEE M
            ON E.MANAGER_ID = M.EMP_ID
        WHERE M.EMP_ID = ?
          AND E.DEPARTMENT = ?
    `;

    const parameters = [
        managerId,
        department
    ];

    return await Db2Connection.query(
        sql,
        parameters
    );
}
}