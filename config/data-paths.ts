import path from 'node:path';
export const DataPath =
{
    login: path.resolve(process.cwd(), 'data/excel/orangeHRM.xlsx'),
};

export const DataSheet =
    {
        login: 'Login',
        dashboard: 'Dashboard',
        survey: 'Survey'
    } as const;