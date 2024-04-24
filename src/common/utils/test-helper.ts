import * as path from 'path';
import { IDatabaseConfig } from '../types/base.type';
import { exec } from 'child_process';

export async function initDatabase(
  databaseConfig: IDatabaseConfig,
): Promise<void> {
  const sqlFilePath = path.join(__dirname, '../../../test/testdb.sql');
  return new Promise<void>((resolve, reject) => {
    exec(
      `mysql -h ${databaseConfig.host} --port ${databaseConfig.port} -u ${databaseConfig.username} -p${databaseConfig.password} ${databaseConfig.database} < ${sqlFilePath};`,
      (error) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        resolve();
      },
    );
  });
}

export function getNonExsitingId(existingIds: Array<number>): number {
  const existingIdsSet = new Set<number>();
  existingIds.forEach((id) => existingIdsSet.add(id));
  let mex = 1;
  while (existingIdsSet.has(mex)) mex++;
  return mex;
}
