import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomsService } from './chatrooms.service';
import { DatabaseModule } from '../database/database.module';
import { MessagesModule } from '../messages/messages.module';
import { EnvConfigModule } from '../env-config/env-config.module';
import { ChatroomsController } from './chatrooms.controller';
import { chatroomsProviders } from './chatrooms.providers';
import { Logger, getNonExsitingId, initDatabase } from 'src/common/utils';
import { EnvConfigService } from '../env-config/env-config.service';
import { Repository } from 'typeorm';
import { UserChatroom } from './entities/user-chatroom.entity';
import {
  CHATROOM_REPOSITORY,
  USER_CHATROOM_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { ChatroomType } from 'src/common/constants/chatroom';
import { Chatroom } from './entities/chatroom.entity';
import { User } from '../users/entities/user.entity';
import { UserChatroomService } from './user-chatroom.service';

describe('ChatroomsService', () => {
  let service: ChatroomsService;
  let envService: EnvConfigService;
  let userRepository: Repository<User>;
  let chatroomRepository: Repository<Chatroom>;
  let userChatroomsRepository: Repository<UserChatroom>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, MessagesModule, EnvConfigModule],
      controllers: [ChatroomsController],
      providers: [...chatroomsProviders, ChatroomsService, UserChatroomService],
    }).compile();

    service = module.get<ChatroomsService>(ChatroomsService);
    envService = module.get<EnvConfigService>(EnvConfigService);
    userChatroomsRepository = module.get<Repository<UserChatroom>>(
      USER_CHATROOM_REPOSITORY,
    );
    chatroomRepository = module.get<Repository<Chatroom>>(CHATROOM_REPOSITORY);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY);

    await initDatabase(envService.getDatabaseConfig());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(envService).toBeDefined();
  });

  it('能根据userId和friendId正确获取单聊聊天室的信息', async () => {
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

      const chatroom = await chatroomRepository.findOne({
        where: { id: chatroomId },
      });
      expect(chatroom).toBeDefined();

      const chatroomBeToTested = await service.getByUserIdAndFriendId(
        userId,
        friendId,
      );
      const friend = await userRepository.findOne({ where: { id: friendId } });
      expect(friend).toBeTruthy();
      expect(chatroomBeToTested).toBeTruthy();
      expect(chatroomBeToTested.id).toBe(chatroom.id);
      expect(chatroomBeToTested.createTime).toBe(chatroom.createTime);
      expect(chatroomBeToTested.type).toBe(ChatroomType.SINGLE);
      expect(chatroomBeToTested.avatarUrl).toBe(friend.avatarUrl);
      expect(chatroomBeToTested.name).toBe(friend.username);

      const nonExistingId = getNonExsitingId(allUserIds);
      Logger.test('nonExistingId', nonExistingId);
      const chatroomToBeNull = await service.getByUserIdAndFriendId(
        nonExistingId,
        userId,
      );
      expect(chatroomToBeNull).not.toBeTruthy();
    }
  });

  it('能根据userId和chatroomId正确获取聊天室的信息', async () => {
    const userChatrooms = await userChatroomsRepository.find({
      relations: ['user', 'chatroom'],
    });
    const chatroomToUsers: Array<[Chatroom, Array<User>]> = [];
    const allUserIds: Array<number> = [];
    for (let i = 0; i < userChatrooms.length; i++) {
      const { user, chatroom } = userChatrooms[i];
      const index = chatroomToUsers.findIndex(
        ([currentChatroom]) => currentChatroom.id === chatroom.id,
      );
      allUserIds.push(user.id);
      if (index === -1) {
        chatroomToUsers.push([chatroom, [user]]);
      } else {
        chatroomToUsers[index][1].push(user);
      }
    }

    for (let i = 0; i < chatroomToUsers.length; i++) {
      const [chatroom, users] = chatroomToUsers[i];
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
      const nonExistingId = getNonExsitingId(allUserIds);
      const chatroomToBeNull = await service.getByChatroomId(
        nonExistingId,
        chatroom.id,
      );
      Logger.test(nonExistingId, users);
      expect(chatroomToBeNull).not.toBeTruthy();
    }
  });

  it('能根据userId正确获取所有聊天室的信息', async () => {
    const users = await userRepository.find();
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
