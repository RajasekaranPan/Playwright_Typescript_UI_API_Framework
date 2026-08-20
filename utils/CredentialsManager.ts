import { Credentials } from '../types/Credentials';

export class CredentialsManager {
  static getCredentials(usernameKey: string, passwordKey: string): Credentials {
    const username = process.env[usernameKey] as string;
    const password = process.env[passwordKey] as string;
    if (!username) {
      throw new Error(`Username credential not found for key: ${usernameKey}`);
    }
    if (!password) {
      throw new Error(`Password credential not found for key: ${passwordKey}`);
    }
    return { username, password };
  }
}
