import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomsService } from '../chatrooms.service';
import { DatabaseModule } from '../../database/database.module';
import { EnvConfigModule } from '../../env-config/env-config.module';
import { chatroomsProviders } from '../chatrooms.providers';
import { initDatabase, getUserNonExistingId } from 'src/common/utils';
import { EnvConfigService } from '../../env-config/env-config.service';
import { Repository } from 'typeorm';
import { UserChatroom } from '../entities/user-chatroom.entity';
import {
  CHATROOM_REPOSITORY,
  USER_CHATROOM_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { ChatroomType } from 'src/common/constants/chatroom';
import { Chatroom } from '../entities/chatroom.entity';
import { User } from '../../users/entities/user.entity';
import { UserChatroomService } from '../user-chatroom.service';

describe('ChatroomsService', () => {
  let service: ChatroomsService;
  let envService: EnvConfigService;
  let usersRepository: Repository<User>;
  let chatroomsRepository: Repository<Chatroom>;
  let userChatroomsRepository: Repository<UserChatroom>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, EnvConfigModule],
      providers: [ChatroomsService, UserChatroomService, ...chatroomsProviders],
    }).compile();

    service = module.get<ChatroomsService>(ChatroomsService);
    envService = module.get<EnvConfigService>(EnvConfigService);
    userChatroomsRepository = module.get<Repository<UserChatroom>>(
      USER_CHATROOM_REPOSITORY,
    );
    chatroomsRepository = module.get<Repository<Chatroom>>(CHATROOM_REPOSITORY);
    usersRepository = module.get<Repository<User>>(USER_REPOSITORY);

    await initDatabase(envService.getDatabaseConfig());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(envService).toBeDefined();
  });

  it('countAll work correctly', async () => {
    const users = await usersRepository.find();
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const correctAll = await userChatroomsRepository.count({
        where: { user: { id: user.id } },
      });
      const all = await service.countAll(user.id);
      expect(all).toBe(correctAll);
    }
  });

  it('getAll work correctly', async () => {
    const users = await usersRepository.find();
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userChatrooms = await userChatroomsRepository.find({
        where: { user: { id: user.id } },
        relations: [
          'chatroom',
          'chatroom.userChatrooms',
          'chatroom.userChatrooms.user',
        ],
      });
      const chatrooms = userChatrooms
        .map(({ chatroom }) => {
          if (chatroom.type === ChatroomType.MULTIPLE) {
            return {
              ...chatroom,
              userChatrooms: undefined,
            };
          }
          const users = chatroom.userChatrooms.map(({ user }) => user);
          const friend = users.find((friend) => friend.id !== user.id);
          return {
            ...chatroom,
            name: friend.username,
            avatarUrl: friend.avatarUrl,
            userChatrooms: undefined,
          };
        })
        .sort((chatroom1, chatroom2) => chatroom1.id - chatroom2.id);
      const chatroomsGetByService = (await service.getAll(user.id)).sort(
        (chatroom1, chatroom2) => chatroom1.id - chatroom2.id,
      );
      expect(chatrooms).toMatchObject(chatroomsGetByService);
    }
  });

  it('getByUserIdAndFriendId work correctly', async () => {
    const userChatrooms = await userChatroomsRepository.find({
      relations: ['user', 'chatroom'],
    });
    expect(userChatrooms.length).toBeGreaterThan(0);

    const chatroomToUsers: Array<[number, Array<number>]> = [];
    const allUserIds: Array<number> = [];
    for (let i = 0; i < userChatrooms.length; i++) {
      const userChatroom = userChatrooms[i];
      const { chatroom, user } = userChatroom;
      expect(chatroom).toBeDefined();
      expect(user).toBeDefined();
      if (chatroom.type === ChatroomType.MULTIPLE) continue;
      allUserIds.push(user.id);
      const index = chatroomToUsers.findIndex(
        ([chatroomId]) => chatroomId === chatroom.id,
      );
      if (index === -1) {
        chatroomToUsers.push([chatroom.id, [user.id]]);
      } else {
        chatroomToUsers[index][1].push(user.id);
      }
    }

    expect(chatroomToUsers.length).toBeGreaterThan(0);
    for (let i = 0; i < chatroomToUsers.length; i++) {
      const [chatroomId, userIds] = chatroomToUsers[i];
      expect(userIds.length).toBe(2);
      const [userId, friendId] = userIds;
      expect(userId).not.toBe(friendId);

      const chatroom = await chatroomsRepository.findOne({
        where: { id: chatroomId },
      });
      expect(chatroom).toBeDefined();

      const chatroomBeToTested = await service.getByUserIdAndFriendId(
        userId,
        friendId,
      );
      const friend = await usersRepository.findOne({ where: { id: friendId } });
      expect(friend).toBeTruthy();
      expect(chatroomBeToTested).toBeTruthy();
      expect(chatroomBeToTested.id).toBe(chatroom.id);
      expect(chatroomBeToTested.createTime).toBe(chatroom.createTime);
      expect(chatroomBeToTested.type).toBe(ChatroomType.SINGLE);
      expect(chatroomBeToTested.avatarUrl).toBe(friend.avatarUrl);
      expect(chatroomBeToTested.name).toBe(friend.username);

      const nonExistingId = await getUserNonExistingId(usersRepository);
      const chatroomToBeNull = await service.getByUserIdAndFriendId(
        nonExistingId,
        userId,
      );
      expect(chatroomToBeNull).not.toBeTruthy();
    }
  });

  it('getByChatroomId work correctly', async () => {
    const userChatrooms = await userChatroomsRepository.find({
      relations: ['user', 'chatroom'],
    });
    const chatroomToUsers: Map<number, [Chatroom, Array<User>]> = new Map();
    for (let i = 0; i < userChatrooms.length; i++) {
      const { user, chatroom } = userChatrooms[i];

      if (!chatroomToUsers.has(chatroom.id)) {
        chatroomToUsers.set(chatroom.id, [chatroom, [user]]);
      } else {
        chatroomToUsers.get(chatroom.id)[1].push(user);
      }
    }

    for (const [chatroom, users] of chatroomToUsers.values()) {
      for (let j = 0; j < users.length; j++) {
        const user = users[j];
        const chatroomToBeTested = await service.getByChatroomId(
          user.id,
          chatroom.id,
        );
        expect(chatroomToBeTested).toBeTruthy();
        expect(chatroomToBeTested.createTime).toBe(chatroom.createTime);
        expect(chatroomToBeTested.type).toBe(chatroom.type);
        if (chatroom.type === ChatroomType.SINGLE) {
          const friend: User = j === 0 ? users[1] : users[0];
          expect(friend).toBeDefined();
          expect(chatroomToBeTested.avatarUrl).toBe(friend.avatarUrl);
        } else {
          expect(chatroomToBeTested.avatarUrl).toBe(chatroom.avatarUrl);
        }
      }
      const nonExistingId = await getUserNonExistingId(usersRepository);
      const chatroomToBeNull = await service.getByChatroomId(
        nonExistingId,
        chatroom.id,
      );
      expect(chatroomToBeNull).not.toBeTruthy();
    }
  });

  it('能根据userId正确获取所有聊天室的信息', async () => {
    const users = await usersRepository.find();
    expect(users.length).toBeGreaterThan(0);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const chatrooms = await service.getAll(user.id);
      for (let j = 0; j < chatrooms.length; j++) {
        const chatroom = chatrooms[j];
        const userChatroom = await userChatroomsRepository.findOne({
          where: {
            user: { id: user.id },
            chatroom: { id: chatroom.id },
          },
        });
        expect(userChatroom).toBeTruthy();
      }
    }
  });
});
