import fs from 'node:fs';
import path from 'node:path';
import {
    EmployeeScenarioData
} from './types';
import { DataPath } from '../../config/data-paths';

export class JsonDataWriter {

    public static write(
        scenarioData: EmployeeScenarioData
    ): void {

        const directory =
            path.dirname(DataPath.generatedDependentsDataPath);

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(
                directory,
                {
                    recursive: true
                }
            );
        }

        fs.writeFileSync(
            DataPath.generatedDependentsDataPath,
            JSON.stringify(
                scenarioData,
                null,
                2
            ),
            'utf-8'
        );
    }
}