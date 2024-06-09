import * as path from 'path';
import { IDatabaseConfig } from '../types/base.type';
import { Repository } from 'typeorm';
import { Chatroom } from 'src/modules/chatrooms/entities/chatroom.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UserChatroom } from 'src/modules/chatrooms/entities/user-chatroom.entity';
import { LoginUserRequestDto } from 'src/modules/auth/dto/login.dto';
import * as mysql from 'mysql2/promise';
import * as fs from 'fs';

export const dataForValidIsNumber = ['not a number', NaN, undefined, null];
export const usersLoginDto: Array<LoginUserRequestDto> = [
  {
    email: 'gamejoye@gmail.com',
    password: '123456..',
  },
  {
    email: 'mikasa@gmail.com',
    password: '123456..',
  },
  {
    email: 'sakura@gmail.com',
    password: '123456..',
  },
];

export async function initDatabase(databaseConfig: IDatabaseConfig) {
  const sqlFilePath = path.join(__dirname, '../../../test/testdb.sql');
  const connection = await mysql.createConnection({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
  });
  const sqls = fs.readFileSync(sqlFilePath, 'utf8').split(/;/m);
  for (const sql of sqls) {
    if (sql.trim()) {
      // 失败直接跳过
      try {
        await connection.execute(sql);
      } catch (_) {}
    }
  }
  await connection.end();
}

export function getNonExsitingId(existingIds: Array<number>): number {
  const existingIdsSet = new Set<number>();
  existingIds.forEach((id) => existingIdsSet.add(id));
  let mex = 1;
  while (existingIdsSet.has(mex)) mex++;
  return mex;
}

export async function getChatroomNonExistingId(
  repository: Repository<Chatroom>,
): Promise<number> {
  let nonExistingId = 1;
  while (true) {
    const chatroom = await repository.findOne({
      where: { id: nonExistingId },
    });
    if (!chatroom) break;
    nonExistingId++;
  }
  return nonExistingId;
}

export async function getUserNonExistingId(
  repository: Repository<User>,
): Promise<number> {
  let nonExistingId = 1;
  while (true) {
    const chatroom = await repository.findOne({
      where: { id: nonExistingId },
    });
    if (!chatroom) break;
    nonExistingId++;
  }
  return nonExistingId;
}

export async function getUserNonExistingEmail(
  repository: Repository<User>,
): Promise<string> {
  const username = 'gamejoye';
  const suffix = '@gmail.com';
  let index = 0;
  while (true) {
    const user = await repository.findOne({
      where: { email: username + index + suffix },
    });
    if (!user) break;
    index++;
  }
  return username + index + suffix;
}

export async function getNonExistingUserChatroom(
  usersRepository: Repository<User>,
  chatroomsRepository: Repository<Chatroom>,
  userChatroomsRepository: Repository<UserChatroom>,
): Promise<Array<{ userId: number; chatroomId: number }>> {
  const users = await usersRepository.find();
  const chatrooms = await chatroomsRepository.find();
  const nonExistingUserChatrooms: Array<{
    userId: number;
    chatroomId: number;
  }> = [];
  for (const user of users) {
    for (const chatroom of chatrooms) {
      const userChatroom = await userChatroomsRepository.findOne({
        where: { user: { id: user.id }, chatroom: { id: chatroom.id } },
      });
      if (!userChatroom) {
        nonExistingUserChatrooms.push({
          userId: user.id,
          chatroomId: chatroom.id,
        });
      }
    }
  }
  return nonExistingUserChatrooms;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
