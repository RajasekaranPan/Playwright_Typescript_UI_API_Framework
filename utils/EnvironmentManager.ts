export class EnvironmentManager {
  static getEnvironment(): string {
    return (process.env.ENV_NAME as string) || 'qa';
  }

  static getBaseUrl(): string {
    const baseUrl = process.env.BASE_URL as string;

    if (!baseUrl) {
      throw new Error('BASE_URL is not configured');
    }

    return baseUrl;
  }

  static getApiBaseUrl(): string {
    const apiBaseUrl = process.env.API_BASE_URL as string;

    if (!apiBaseUrl) {
      throw new Error('API_BASE_URL is not configured');
    }

    return apiBaseUrl;
  }
}
