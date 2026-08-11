import path from 'node:path';
import fs from 'node:fs';
import { ExcelReader } from './ExcelReader';
import { LoginTestData } from '../types/LoginTestData';
import { DataPath, DataSheet } from '../config/data-paths';

export class TestDataLoader {

    static getLoginData(): LoginTestData[] {

        const filePath = DataPath.login;


        console.log('Current directory:', process.cwd());
        console.log('Excel path:', DataPath.login);
        console.log('File exists:', fs.existsSync(DataPath.login));
        console.log('Sheet: ', DataSheet.login);

        
//We directly return the data read from excel sheet as JS typed object to the test file.
        const data = ExcelReader.readSheet<LoginTestData>(
            filePath,
            DataSheet.login
        );

        // Below is just for demonstration purpose to show 
        // how to write the data into a JSON file.
        fs.writeFileSync(
    'data/json/orangeHRM.json',
    JSON.stringify(data, null, 2),
    'utf-8'
);
        return data;
    }
}