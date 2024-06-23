import * as path from 'path';
import { IDatabaseConfig } from '../types/base.type';
import { Repository } from 'typeorm';
import { Chatroom } from 'src/modules/chatrooms/entities/chatroom.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UserChatroom } from 'src/modules/chatrooms/entities/user-chatroom.entity';
import { LoginUserRequestDto } from 'src/modules/auth/dto/login.dto';
import { exec } from 'child_process';

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

export async function getChatroomNonExistingId(
  repository: Repository<Chatroom>,
): Promise<number> {
  let nonExistingId = 1;
  const all = await repository.find();
  const ids = new Set();
  all.forEach((chatroom) => ids.add(chatroom.id));
  while (ids.has(nonExistingId)) {
    nonExistingId++;
  }
  return nonExistingId;
}

export async function getUserNonExistingId(
  repository: Repository<User>,
): Promise<number> {
  let nonExistingId = 1;
  const all = await repository.find();
  const ids = new Set();
  all.forEach((user) => ids.add(user.id));
  while (ids.has(nonExistingId)) {
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
  const all = await repository.find();
  const emails = new Set();
  all.forEach((user) => emails.add(user.email));
  while (emails.has(username + index + suffix)) {
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
  const existingUserChatrooms = new Set<string>();
  const all = await userChatroomsRepository.find({
    relations: ['user', 'chatroom'],
  });
  all.forEach((userChatroom) =>
    existingUserChatrooms.add(
      userChatroom.user.id + '-' + userChatroom.chatroom.id,
    ),
  );
  for (const user of users) {
    for (const chatroom of chatrooms) {
      if (!existingUserChatrooms.has(user.id + '-' + chatroom.id)) {
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
