import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomsController } from '../chatrooms.controller';
import { DatabaseModule } from '../../database/database.module';
import { chatroomsProviders } from '../chatrooms.providers';
import { ChatroomsService } from '../chatrooms.service';
import { UserChatroomService } from '../user-chatroom.service';
import { IUserChatroomService } from '../interface/user-chatrooms.service.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { getCurrentDatetime } from 'src/common/utils';
import { UserChatroom } from '../entities/user-chatroom.entity';
import { Chatroom } from '../entities/chatroom.entity';
import { ChatroomType } from 'src/common/constants/chatroom';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IChatroomsService } from '../interface/chatrooms.service.interface';
import { IMessagesService } from 'src/modules/messages/interface/messages.service.interface';
import { MessagesService } from 'src/modules/messages/messages.service';
import { Message } from 'src/modules/messages/entities/message.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

/**
 * 测试所需常量
 */
const user: User = {
  id: 1,
  username: 'user',
  email: 'user@gmail.com',
  passwordHash: '',
  avatarUrl: '',
  description: '',
  createTime: getCurrentDatetime(),
  userChatrooms: [],
  fromFriendships: [],
  toFriendships: [],
  fromFriendRequests: [],
  toFriendRequests: [],
};
const friend1: User = {
  id: 2,
  username: 'friend1',
  email: 'friend1@gmail.com',
  passwordHash: '',
  avatarUrl: '',
  description: '',
  createTime: getCurrentDatetime(),
  userChatrooms: [],
  fromFriendships: [],
  toFriendships: [],
  fromFriendRequests: [],
  toFriendRequests: [],
};
const chatroom: Chatroom = {
  id: 2,
  type: ChatroomType.MULTIPLE,
  name: '爱之诗',
  avatarUrl: '',
  createTime: getCurrentDatetime(),
  userChatrooms: [],
  messages: [],
};
const chatroom2: Chatroom = {
  id: 3,
  type: ChatroomType.MULTIPLE,
  name: '鸟之诗',
  avatarUrl: '',
  createTime: getCurrentDatetime(),
  userChatrooms: [],
  messages: [],
};
const singleChatroom1: Chatroom = {
  id: 4,
  type: ChatroomType.SINGLE,
  name: null,
  avatarUrl: null,
  createTime: getCurrentDatetime(),
  userChatrooms: [],
  messages: [],
};
const singleChatroom2: Chatroom = {
  id: 5,
  type: ChatroomType.SINGLE,
  name: null,
  avatarUrl: null,
  createTime: getCurrentDatetime(),
  userChatrooms: [],
  messages: [],
};
const allChatrooms = [chatroom, chatroom2, singleChatroom1, singleChatroom2];
const message: Message = {
  id: 1,
  chatroom: chatroom,
  from: user,
  content: 'message content',
  createTime: getCurrentDatetime(),
};
const message2: Message = {
  id: 2,
  chatroom: chatroom2,
  from: user,
  content: 'message content from 2',
  createTime: getCurrentDatetime(),
};
const messageFromSingleChatroom1: Message = {
  id: 3,
  chatroom: singleChatroom1,
  from: user,
  content: 'message content from single chatroom 1',
  createTime: getCurrentDatetime(),
};
const messageFromSingleChatroom2: Message = {
  id: 4,
  chatroom: singleChatroom2,
  from: user,
  content: 'message content from single chatroom 2',
  createTime: getCurrentDatetime(),
};
const allMessages = [
  message,
  message2,
  messageFromSingleChatroom1,
  messageFromSingleChatroom2,
];

const mockUserChatroomService: Partial<IUserChatroomService> = {
  updateLatestVisitTime: jest.fn(),
  getByUserIdAndChatroomId: jest.fn(),
};

const mockChatroomsService: Partial<IChatroomsService> = {
  getByChatroomId: jest.fn(),
  getByUserIdAndFriendId: jest.fn(),
  getAll: jest.fn(),
};

const mockMessagesService: Partial<IMessagesService> = {
  countByTime: jest.fn(),
  getLatestMessageByChatroomId: jest.fn(),
};

describe('ChatroomsController', () => {
  let controller: ChatroomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          load: [configuration],
          isGlobal: true,
        }),
      ],
      controllers: [ChatroomsController],
      providers: [
        ...chatroomsProviders,
        ChatroomsService,
        UserChatroomService,
        MessagesService,
      ],
    })
      .overrideProvider(UserChatroomService)
      .useValue(mockUserChatroomService)
      .overrideProvider(ChatroomsService)
      .useValue(mockChatroomsService)
      .overrideProvider(MessagesService)
      .useValue(mockMessagesService)
      .compile();

    controller = module.get<ChatroomsController>(ChatroomsController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('visitChatroom逻辑验证', async () => {
    const timestamp = getCurrentDatetime();
    const mockValue: UserChatroom = {
      id: 3,
      createTime: getCurrentDatetime(),
      latestVisitTime: getCurrentDatetime(),
      user,
      chatroom,
    };

    // 获取到userChatroom的逻辑
    (
      mockUserChatroomService.updateLatestVisitTime as jest.Mock
    ).mockResolvedValue(mockValue);

    await controller.visitChatroom(user, { timestamp }, chatroom.id);
    expect(mockUserChatroomService.updateLatestVisitTime).toHaveBeenCalledWith(
      user.id,
      chatroom.id,
      timestamp,
    );

    // 没有获取到userChatroom的逻辑
    (
      mockUserChatroomService.updateLatestVisitTime as jest.Mock
    ).mockResolvedValue(null);
    await controller
      .visitChatroom(user, { timestamp }, chatroom.id)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
  });

  it('getChatroom逻辑验证', async () => {
    // 获取到chatroom的逻辑
    (mockChatroomsService.getByChatroomId as jest.Mock).mockResolvedValue(
      chatroom,
    );
    await controller.getChatroom(user, chatroom.id);
    expect(mockChatroomsService.getByChatroomId).toHaveBeenCalledWith(
      user.id,
      chatroom.id,
    );

    // 没有获取到chatroom的逻辑
    (mockChatroomsService.getByChatroomId as jest.Mock).mockResolvedValue(null);
    await controller
      .getChatroom(user, chatroom.id)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
  });

  it('getSingleChatroomByFriendId逻辑验证', async () => {
    // 获取到friend的逻辑
    (
      mockChatroomsService.getByUserIdAndFriendId as jest.Mock
    ).mockResolvedValue(friend1);
    await controller.getSingleChatroomByFriendId(user, {
      friend_id: friend1.id,
    });
    expect(mockChatroomsService.getByUserIdAndFriendId).toHaveBeenCalledWith(
      user.id,
      friend1.id,
    );

    // 没有获取到friend的逻辑
    (
      mockChatroomsService.getByUserIdAndFriendId as jest.Mock
    ).mockResolvedValue(null);
    await controller
      .getSingleChatroomByFriendId(user, {
        friend_id: friend1.id,
      })
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
  });

  it('getChatroomSummary逻辑', async () => {
    // 获取到chatroom的逻辑
    (mockChatroomsService.getByChatroomId as jest.Mock).mockResolvedValue(
      chatroom,
    );
    (mockMessagesService.countByTime as jest.Mock).mockResolvedValue(0);
    (
      mockMessagesService.getLatestMessageByChatroomId as jest.Mock
    ).mockResolvedValue(message);
    const userChatroom: UserChatroom = {
      id: 1,
      createTime: getCurrentDatetime(),
      latestVisitTime: getCurrentDatetime(),
      user: user,
      chatroom: chatroom,
    };
    (
      mockUserChatroomService.getByUserIdAndChatroomId as jest.Mock
    ).mockResolvedValue(userChatroom);
    const timestamp = getCurrentDatetime();
    await controller.getChatroomSummary(user, chatroom.id);
    expect(mockChatroomsService.getByChatroomId).toHaveBeenCalledWith(
      user.id,
      chatroom.id,
    );
    expect(mockMessagesService.countByTime).toHaveBeenCalledWith(
      chatroom.id,
      timestamp,
    );
    expect(
      mockMessagesService.getLatestMessageByChatroomId,
    ).toHaveBeenCalledWith(chatroom.id);

    // 没有获取到chatroom的逻辑
    (mockChatroomsService.getByChatroomId as jest.Mock).mockResolvedValue(null);
    await controller
      .getChatroomSummary(user, chatroom.id)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
  });

  it('getChatroomSummaries逻辑', async () => {
    (mockChatroomsService.getAll as jest.Mock).mockResolvedValue(allChatrooms);
    (
      mockMessagesService.getLatestMessageByChatroomId as jest.Mock
    ).mockImplementation((chatroomId) => {
      return allMessages.find((message) => message.chatroom.id === chatroomId);
    });
    (mockMessagesService.countByTime as jest.Mock).mockResolvedValue(0);
    let userChatroomId = 0;
    (
      mockUserChatroomService.getByUserIdAndChatroomId as jest.Mock
    ).mockImplementation((_userId: number, chatroomId: number) => {
      const timestamp = getCurrentDatetime();
      const userChatroom: UserChatroom = {
        id: ++userChatroomId,
        createTime: timestamp,
        latestVisitTime: timestamp,
        user,
        chatroom: allChatrooms.find((chatroom) => chatroom.id === chatroomId),
      };
      return userChatroom;
    });

    await controller.getChatroomSummaries(user);
    // 函数调用次数
    expect(mockChatroomsService.getAll).toHaveBeenCalledTimes(1);
    expect(
      mockMessagesService.getLatestMessageByChatroomId,
    ).toHaveBeenCalledTimes(allChatrooms.length);
    expect(mockMessagesService.countByTime).toHaveBeenCalledTimes(
      allChatrooms.length,
    );
    expect(
      mockUserChatroomService.getByUserIdAndChatroomId,
    ).toHaveBeenCalledTimes(allChatrooms.length);
    // 函数参数
    for (let ith = 1; ith <= allChatrooms.length; ith++) {
      expect(
        mockUserChatroomService.getByUserIdAndChatroomId,
      ).toHaveBeenNthCalledWith(ith, user.id, expect.any(Number));
    }
  });
});
