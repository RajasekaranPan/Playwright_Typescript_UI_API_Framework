import path from 'node:path';
export const DataPath =
{
    orangeHRM: path.resolve(process.cwd(), 'data/excel/orangeHRM.xlsx'),
    generatedDependentsDataPath: path.resolve(process.cwd(), 'data/generated/dependents.json'),
    convertedJson: path.resolve(process.cwd(), 'data/normalised-json/excelToJson.json')
};

export const DataSheet =
    {
        login: 'Login',
        employee: 'Employee',
        dashboard: 'Dashboard',
        survey: 'Survey'
    } as const;