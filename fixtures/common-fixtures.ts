import { test as base } from '../fixtures/pom-fixtures';
import CommonUtils from '../utils/CommonUtils';

type CommonUtilsFixture = {
  commonUtils: CommonUtils;
};

//ESLint configuration can explicitly allow unused variables beginning with _.
const test = base.extend<CommonUtilsFixture>({
  commonUtils: async (_, use) => {
    await use(new CommonUtils());
  },
});

export { test };
