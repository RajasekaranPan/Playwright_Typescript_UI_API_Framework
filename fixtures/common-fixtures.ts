import {test as base} from "../fixtures/pom-fixtures"
import CommonUtils from "../utils/CommonUtils";

type commonUtilsFixture = {
    commonUtils: CommonUtils;
}   

const test = base.extend<commonUtilsFixture>({
    commonUtils: async ({}, use) => {    
        await use(new CommonUtils());
    }
});

export { test };