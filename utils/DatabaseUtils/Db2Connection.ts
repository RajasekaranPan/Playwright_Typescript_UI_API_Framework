import * as ibmdb from 'ibm_db';

export class Db2Connection {
  private static connectionString(): string {
    return [
      `DATABASE=${process.env.DB2_DATABASE}`,
      `HOSTNAME=${process.env.DB2_HOSTNAME}`,
      `PORT=${process.env.DB2_PORT}`,
      `UID=${process.env.DB2_USERNAME}`,
      `PWD=${process.env.DB2_PASSWORD}`,
      `PROTOCOL=TCPIP`,
    ].join(';');
  }

  static async connect() {
    return ibmdb.open(this.connectionString());
  }

  static async query<T>(sql: string, parameters: ibmdb.SQLParam[] = []): Promise<T[]> {
    const connection = await this.connect();

    try {
      const result = await connection.query(sql, parameters);

      return result as unknown as T[];
    } finally {
      await connection.close();
    }
  }
}
