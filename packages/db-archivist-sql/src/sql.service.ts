/*
 * @Author: XY | The Findables Company <ryanxyo>
 * @Date:   Wednesday, 24th October 2018 3:52:32 pm
 * @Email:  developer@xyfindables.com
 * @Filename: sql.service.ts
 * @Last modified by: ryanxyo
 * @Last modified time: Tuesday, 13th November 2018 1:46:41 pm
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import { default as mysql, Connection, MysqlError } from 'mysql';
import { XyoBase } from '@xyo-network/sdk-core-nodejs';

export class SqlService extends XyoBase {
  private connection: Connection | undefined;

  constructor(private readonly options: {
    host?: string,
    user?: string,
    password?: string,
    database?: string,
    port?: number,
    connection?: any
  }) {
    super();
  }

  public async query<T>(q: string, substitutions?: any[]): Promise<T> {
    const c = await this.getOrCreateConnection();
    return new Promise((resolve, reject) => {
      const callback = (error: MysqlError | null, results: T) => {
        if (error) {
          return reject(error);
        }

        return resolve(results);
      };

      const query = substitutions ? c.query(q, substitutions, callback) : c.query(q, callback);
      this.logInfo(query.sql);
    }) as Promise<T>;
  }

  public async startTransaction(): Promise<ISqlTransaction> {
    const connection = await this.getOrCreateConnection();
    this.connection = undefined; // Set to undefined so queries come in it grabs a new connection

    return new Promise((resolve, reject) => {
      connection.beginTransaction(() => {
        const rollback = (): Promise<void> => {
          this.logInfo(`Rolling back transaction`);
          return new Promise((res, rej) => {
            connection.rollback((err) => {
              this.logInfo(`Callback for rollback called with value ${err}`);
            });
            res();
          });
        };

        const commit = (): Promise<void> => {
          return new Promise((res, rej) => {
            connection.commit(async (err) => {
              this.logInfo(`Callback for commit called`);
              if (err) {
                await rollback();
                rej(err);
              }
              res();
            });

          });
        };
        return resolve({
          sqlService: new SqlService({ connection }),
          rollback,
          commit
        });
      });
    }) as Promise<ISqlTransaction>;
  }

  public stop(): Promise<void> {
    return this.endConnection();
  }

  private async getOrCreateConnection(maxTries: number = 5, tryNumber: number = 1): Promise<Connection> {
    if (this.connection) {
      return this.connection;
    }

    this.logInfo(`Trying to get connection. Try number ${tryNumber} of ${maxTries}`);
    const c = mysql.createConnection(this.options);

    return new Promise((resolve, reject) => {
      c.connect((err: Error | undefined) => {
        if (err) {
          this.logInfo(`Failed get connection. Try number ${tryNumber} of ${maxTries}`);
          if (tryNumber === maxTries) {
            return reject(err);
          }

          return setTimeout(() => {
            return this.getOrCreateConnection(maxTries, tryNumber + 1).then(resolve).catch(reject);
          }, 1000 * Math.pow(2, tryNumber)); // exponential backoff
        }

        this.connection = c;
        return resolve(this.connection);
      });
    }) as Promise<Connection>;
  }

  private async endConnection(): Promise<void> {
    if (this.connection) {
      const c = this.connection;
      this.connection = undefined;

      return new Promise((resolve, reject) => {
        c.end((err: Error | undefined) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }) as Promise<void>;
    }
  }
}

interface ISqlTransaction {
  sqlService: SqlService;

  commit(): Promise<void>;
  rollback(): Promise<void>;
}
