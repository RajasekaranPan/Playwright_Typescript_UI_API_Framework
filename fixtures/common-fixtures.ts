import {test as base} from "../fixtures/pom-fixtures"
import CommonUtils from "../utils/CommonUtils";

type CommonUtilsFixture = {
    commonUtils: CommonUtils;
}   

const test = base.extend<CommonUtilsFixture>({
    commonUtils: async ({}, use) => {    
        await use(new CommonUtils());
    }
});

export { test };