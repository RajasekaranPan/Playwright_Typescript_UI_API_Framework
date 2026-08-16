import { test } from '@playwright/test';

import {
    ScenarioDataFactory
} from '../../../utils/TestDataUtilities/ScenarioDataFactory';
import {
    JsonDataWriter
} from '../../../utils/TestDataUtilities/JsonDataWriter';

test(
    'Create dependent for 401(k) catch-up employee',

    {tag: ['@Faker'],
    annotation: [{
        type: "Test Case Link",
        description: "https:jira.com/"
    },
    {type: "Defect",
        description: "https:jira.com/defects"
    }]
    },

    async () => {

        const scenario =
            ScenarioDataFactory
                .create401kCatchUpScenario();

        console.log(
            'Selected employee:',
            scenario.employee
        );

        console.log(
            'Generated dependents:',
            scenario.dependents
        );

        JsonDataWriter.write(
            scenario
        );

        // Next:
        // await employeePage.addDependent(
        //     scenario.dependents[0]
        // );
    }
);