import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { DatabaseModule } from '../../database/database.module';
import { usersProviders } from '../users.providers';
import { UsersService } from '../users.service';
import { IUsersService } from '../interface/users.service.interface';
import { User } from '../entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { transformFriendInfo, transformUser } from '../vo/utils/user-transform';
import { FriendInfo } from '../types/friend-info.type';
import { Response } from 'express';
import { getCurrentDatetime } from 'src/common/utils';
import { FriendRequest } from '../entities/friendrequest.entity';
import { FriendRequestType } from 'src/common/constants/friendrequest';
import { WsGatewayService } from 'src/modules/ws-gateway/ws-gateway.service';
import { IWsGatewayService } from 'src/modules/ws-gateway/interface/ws-gateway.interface.service';
import { WsGatewayModule } from 'src/modules/ws-gateway/ws-gateway.module';
import { ChatroomsModule } from 'src/modules/chatrooms/chatrooms.module';
import { IChatroomsService } from 'src/modules/chatrooms/interface/chatrooms.service.interface';
import { ChatroomsService } from 'src/modules/chatrooms/chatrooms.service';
import { Chatroom } from 'src/modules/chatrooms/entities/chatroom.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { Config } from 'src/config/configuration';

/**
 * 数据
 */
const user1: User = {
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
const user2: User = {
  id: 2,
  username: 'user2222',
  email: 'user222@gmail.com',
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
const user3: User = {
  id: 3,
  username: 'user3333',
  email: 'user3333@gmail.com',
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

const mockUsersService: Partial<IUsersService> = {
  getById: jest.fn(),
  getByEmail: jest.fn(),
  getFriends: jest.fn(),
  getFriendInfoByUserIdAndFriendId: jest.fn(),
  getFriendRqeusts: jest.fn(),
  getFriendRequestById: jest.fn(),
  createFriendRequest: jest.fn(),
  updateFriendRequestStatus: jest.fn(),
};

const mockWsGateWayService: Partial<IWsGatewayService> = {
  notifyNewFriend: jest.fn(),
  notifyNewFriendRequest: jest.fn(),
  notifyNewChatroom: jest.fn(),
};

const mockChatroomsService: Partial<IChatroomsService> = {
  getByUserIdAndFriendId: jest.fn(),
};

describe('UserController', () => {
  let controller: UsersController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          load: [configuration],
          isGlobal: true,
        }),
        WsGatewayModule,
        ChatroomsModule,
      ],
      controllers: [UsersController],
      providers: [...usersProviders, UsersService],
      exports: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(WsGatewayService)
      .useValue(mockWsGateWayService)
      .overrideProvider(ChatroomsService)
      .useValue(mockChatroomsService)
      .compile();

    controller = module.get<UsersController>(UsersController);
    configService = module.get<ConfigService>(ConfigService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getUserByEmail', async () => {
    (mockUsersService.getByEmail as jest.Mock).mockImplementation(
      (email: string) => {
        if (email === user1.email) return user1;
        return null;
      },
    );
    const userVo = await controller.getUserByEmail({ email: user1.email });
    expect(userVo.id).toBe(user1.id);
    expect(mockUsersService.getByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersService.getByEmail).toHaveBeenCalledWith(user1.email);

    await controller
      .getUserByEmail({ email: user2.email })
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
  });

  it('acceptFriendRequest', async () => {
    const existingFq: FriendRequest = {
      id: 1,
      from: user1,
      to: user2,
      status: FriendRequestType.PENDING,
      createTime: getCurrentDatetime(),
      updateTime: getCurrentDatetime(),
    };
    (mockUsersService.getFriendRequestById as jest.Mock).mockImplementation(
      (id: number) => {
        if (id === existingFq.id) return existingFq;
        return null;
      },
    );
    (
      mockUsersService.updateFriendRequestStatus as jest.Mock
    ).mockImplementation((id: number, status: FriendRequestType) => {
      if (id === existingFq.id) {
        return {
          ...existingFq,
          status,
        };
      }
      return null;
    });
    const existingChatroom = new Chatroom();
    (
      mockChatroomsService.getByUserIdAndFriendId as jest.Mock
    ).mockImplementation((userId: number, friendId: number) => {
      if (
        (userId === existingFq.from.id && friendId === existingFq.to.id) ||
        (userId === existingFq.to.id && friendId === existingFq.from.id)
      ) {
        return existingChatroom;
      }
      return null;
    });
    await controller.acceptFriendRequest(
      existingFq.to,
      existingFq.to.id,
      existingFq.id,
    );
    expect(mockUsersService.getFriendRequestById).toHaveBeenCalledTimes(1);
    expect(mockUsersService.getFriendRequestById).toHaveBeenCalledWith(
      existingFq.id,
    );
    expect(mockUsersService.updateFriendRequestStatus).toHaveBeenCalledTimes(1);
    expect(mockUsersService.updateFriendRequestStatus).toHaveBeenCalledWith(
      existingFq.id,
      FriendRequestType.ACCEPT,
    );
    expect(mockWsGateWayService.notifyNewFriend).toHaveBeenCalledTimes(2);
    expect(mockWsGateWayService.notifyNewFriend).toHaveBeenCalledWith(
      existingFq.from.id,
      existingFq.to,
    );
    expect(mockWsGateWayService.notifyNewFriend).toHaveBeenCalledWith(
      existingFq.to.id,
      existingFq.from,
    );
    expect(mockWsGateWayService.notifyNewChatroom).toHaveBeenCalledTimes(2);
    expect(mockWsGateWayService.notifyNewChatroom).toHaveBeenCalledWith(
      existingFq.from.id,
      existingChatroom,
    );
    expect(mockWsGateWayService.notifyNewChatroom).toHaveBeenCalledWith(
      existingFq.to.id,
      existingChatroom,
    );

    // FORBBIDEN
    await controller
      .acceptFriendRequest(existingFq.from, existingFq.to.id, existingFq.id)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
      });
  });

  it('rejectFriendRequest', async () => {
    const existingFq: FriendRequest = {
      id: 1,
      from: user1,
      to: user2,
      status: FriendRequestType.PENDING,
      createTime: getCurrentDatetime(),
      updateTime: getCurrentDatetime(),
    };
    (mockUsersService.getFriendRequestById as jest.Mock).mockImplementation(
      (id: number) => {
        if (id === existingFq.id) return existingFq;
        return null;
      },
    );
    (
      mockUsersService.updateFriendRequestStatus as jest.Mock
    ).mockImplementation((id: number, status: FriendRequestType) => {
      if (id === existingFq.id) {
        return {
          ...existingFq,
          status,
        };
      }
      return null;
    });

    await controller.rejectFriendRequest(
      existingFq.to,
      existingFq.to.id,
      existingFq.id,
    );
    expect(mockUsersService.getFriendRequestById).toHaveBeenCalledTimes(1);
    expect(mockUsersService.getFriendRequestById).toHaveBeenCalledWith(
      existingFq.id,
    );
    expect(mockUsersService.updateFriendRequestStatus).toHaveBeenCalledTimes(1);
    expect(mockUsersService.updateFriendRequestStatus).toHaveBeenCalledWith(
      existingFq.id,
      FriendRequestType.REJECT,
    );
    expect(mockWsGateWayService.notifyNewFriendRequest).toHaveBeenCalledTimes(
      2,
    );
    expect(mockWsGateWayService.notifyNewFriendRequest).toHaveBeenCalledWith(
      existingFq.from.id,
      { ...existingFq, status: FriendRequestType.REJECT },
    );
    expect(mockWsGateWayService.notifyNewFriendRequest).toHaveBeenCalledWith(
      existingFq.to.id,
      { ...existingFq, status: FriendRequestType.REJECT },
    );

    await controller
      .rejectFriendRequest(existingFq.from, existingFq.to.id, existingFq.id)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
      });
  });

  it('postFriendRequest', async () => {
    const pendingRq: FriendRequest = {
      id: 1,
      from: user1,
      to: user2,
      status: FriendRequestType.PENDING,
      createTime: getCurrentDatetime(),
      updateTime: null,
    };
    const acceptRq: FriendRequest = {
      id: 1,
      from: user2,
      to: user3,
      status: FriendRequestType.ACCEPT,
      createTime: getCurrentDatetime(),
      updateTime: getCurrentDatetime(),
    };
    const called = new Set<string>();
    (mockUsersService.createFriendRequest as jest.Mock).mockImplementation(
      (from: number, to: number) => {
        let fq: FriendRequest;
        if (!called.has(to + ',' + from)) {
          fq = pendingRq;
        } else {
          if (called.has(from + ',' + to)) {
            return null;
          }
          fq = acceptRq;
        }
        called.add(from + ',' + to);
        return fq;
      },
    );
    const existingChatroom = new Chatroom();
    (
      mockChatroomsService.getByUserIdAndFriendId as jest.Mock
    ).mockImplementation((userId: number, friendId: number) => {
      if (
        (userId === user2.id && friendId === user3.id) ||
        (userId === user3.id && friendId === user2.id)
      ) {
        return existingChatroom;
      }
      return null;
    });
    await controller.postFriendRequest(user1, user1.id, {
      from: user1.id,
      to: user2.id,
    });
    expect(mockUsersService.createFriendRequest).toHaveBeenCalledTimes(1);
    expect(mockUsersService.createFriendRequest).toHaveBeenCalledWith(
      user1.id,
      user2.id,
    );
    expect(mockWsGateWayService.notifyNewFriendRequest).toHaveBeenCalledTimes(
      2,
    );
    expect(mockWsGateWayService.notifyNewFriendRequest).toHaveBeenCalledWith(
      user2.id,
      pendingRq,
    );

    jest.clearAllMocks();
    await controller.postFriendRequest(user2, user2.id, {
      from: user2.id,
      to: user3.id,
    });
    await controller.postFriendRequest(user3, user3.id, {
      from: user3.id,
      to: user2.id,
    });
    expect(mockUsersService.createFriendRequest).toHaveBeenCalledTimes(2);
    expect(mockUsersService.createFriendRequest).toHaveBeenCalledWith(
      user2.id,
      user3.id,
    );
    expect(mockWsGateWayService.notifyNewFriend).toHaveBeenCalledTimes(2);
    expect(mockWsGateWayService.notifyNewFriend).toHaveBeenCalledWith(
      user3.id,
      user2,
    );
    expect(mockWsGateWayService.notifyNewFriend).toHaveBeenCalledWith(
      user2.id,
      user3,
    );
    expect(mockWsGateWayService.notifyNewChatroom).toHaveBeenCalledTimes(2);
    expect(mockWsGateWayService.notifyNewFriendRequest).toHaveBeenCalledTimes(
      4,
    );
    expect(mockWsGateWayService.notifyNewFriendRequest).toHaveBeenCalledWith(
      user2.id,
      acceptRq,
    );
    expect(mockWsGateWayService.notifyNewFriendRequest).toHaveBeenCalledWith(
      user3.id,
      acceptRq,
    );
    expect(mockWsGateWayService.notifyNewChatroom).toHaveBeenCalledWith(
      user2.id,
      existingChatroom,
    );
    expect(mockWsGateWayService.notifyNewChatroom).toHaveBeenCalledWith(
      user3.id,
      existingChatroom,
    );

    // 重复发起
    await controller
      .postFriendRequest(user2, user2.id, {
        from: user2.id,
        to: user3.id,
      })
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.CONFLICT);
      });

    // 异常
    await controller
      .postFriendRequest(user2, user1.id, {
        from: user3.id,
        to: user1.id,
      })
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
      });
  });

  it('getFriendRequestsById', async () => {
    const current = getCurrentDatetime();
    const fqs: Array<FriendRequest> = [
      {
        id: 1,
        createTime: current,
        updateTime: current,
        status: FriendRequestType.ACCEPT,
        from: user1,
        to: user2,
      },
    ];
    (mockUsersService.getFriendRqeusts as jest.Mock).mockResolvedValue(fqs);

    /**
     * 异常流程
     */
    await controller
      .getFriendRequestsById(user1, user2.id)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
      });
    expect(mockUsersService.getFriends).toHaveBeenCalledTimes(0);

    /**
     * 正常流程
     */
    await controller.getFriendRequestsById(user1, user1.id);
    expect(mockUsersService.getFriendRqeusts).toHaveBeenCalledTimes(1);
    expect(mockUsersService.getFriendRqeusts).toHaveBeenCalledWith(user1.id);
  });

  it('getUserByid work correctly', async () => {
    (mockUsersService.getById as jest.Mock).mockImplementation((userId) => {
      if (userId === user2.id) {
        return user2;
      }
      return null;
    });
    await controller.getUserById(user2.id);
    expect(mockUsersService.getById).toHaveBeenCalledTimes(1);
    expect(mockUsersService.getById).toHaveBeenCalledWith(user2.id);

    await controller
      .getUserById(user1.id)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
  });

  it('getFriendsById work correctly', async () => {
    (mockUsersService.getFriends as jest.Mock).mockResolvedValue([user2]);

    /**
     * 异常流程
     */
    await controller
      .getFriendsById(user1, user2.id)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
      });
    expect(mockUsersService.getFriends).toHaveBeenCalledTimes(0);

    /**
     * 正常流程
     */
    await controller
      .getFriendsById(user1, user1.id)
      .then((friends) => {
        expect(friends).toMatchObject(
          [user2].map((user) => transformUser(user)),
        );
      })
      .catch(() => {
        expect(true).toBe(false);
      });
    expect(mockUsersService.getFriends).toHaveBeenCalledTimes(1);
  });

  it('getFriendInfoByUserIdAndFriendId work correctly', async () => {
    const friendInfo: FriendInfo = {
      user: user2,
      createTime: getCurrentDatetime(),
    };
    (
      mockUsersService.getFriendInfoByUserIdAndFriendId as jest.Mock
    ).mockResolvedValue(friendInfo);
    /**
     * 异常逻辑
     */
    await controller
      .getFriendInfoByUserIdAndFriendId(user1, user2.id, user2.id)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
      });
    expect(
      mockUsersService.getFriendInfoByUserIdAndFriendId,
    ).toHaveBeenCalledTimes(0);

    /**
     * 正常逻辑
     */
    const friendInfoVo = await controller.getFriendInfoByUserIdAndFriendId(
      user1,
      user1.id,
      user2.id,
    );
    expect(
      mockUsersService.getFriendInfoByUserIdAndFriendId,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockUsersService.getFriendInfoByUserIdAndFriendId,
    ).toHaveBeenCalledWith(user1.id, user2.id);
    expect(friendInfoVo).toMatchObject(transformFriendInfo(friendInfo));
  });

  it('uploadAvatar work correctly', async () => {
    const filename = 'testimg.jpg';
    const originalname = 'original.jpg';
    const file = {
      filename,
      originalname,
    } as Express.Multer.File;
    const res = {} as Response;
    const url = controller.uploadAvatar(file, res);
    const avatarBaseUrl = configService.get<Config['avatar']>('avatar').url;
    expect(url).toBe(avatarBaseUrl + '/' + filename);
  });
});
