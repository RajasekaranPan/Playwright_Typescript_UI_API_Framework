export const apiConfig = {
    baseUrl: requiredEnv('API_BASE_URL'),
    username: requiredEnv('API_USERNAME'),
    password: requiredEnv('API_PASSWORD')
};

function requiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Required environment variable '${name}' is not configured`
        );
    }

    return value;
}
