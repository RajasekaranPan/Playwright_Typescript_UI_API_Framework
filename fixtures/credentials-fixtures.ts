import { test as base } from "../fixtures/common-fixtures";

type Fixtures = {
    decryptedValidCredentials: {
        app_username: string;
        app_password: string;
    };
};

//Example of Test Fixtures
//Before any test we can use this decrypted credentials 
//Usage: @ tests\without-hooks-test_1.spec.ts
const test = base.extend<Fixtures>({
    decryptedValidCredentials: async ({ commonUtils }, use) => {
        const encryptedUsername = process.env.VALID_USERNAME as string;
        const encryptedPassword = process.env.VALID_PASSWORD as string;

        const app_username = commonUtils.decryptData(encryptedUsername);
        const app_password = commonUtils.decryptData(encryptedPassword);

        await use({
            app_username,
            app_password,
        });
    },
});

export {test}