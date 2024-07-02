import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { DatabaseModule } from '../../database/database.module';
import { usersProviders } from '../users.providers';
import { UsersService } from '../users.service';
import { EnvConfigModule } from '../../env-config/env-config.module';
import { IUsersService } from '../interface/users.service.interface';
import { User } from '../entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { transformFriendInfo, transformUser } from '../vo/utils/user-transform';
import { FriendInfo } from '../types/friend-info.type';
import { Response } from 'express';
import { EnvConfigService } from 'src/modules/env-config/env-config.service';
import { getCurrentDatetime } from 'src/common/utils';
import { FriendRequest } from '../entities/friendrequest.entity';
import { FriendRequestType } from 'src/common/constants/friendrequest';
import { WsGatewayService } from 'src/modules/ws-gateway/ws-gateway.service';
import { IWsGatewayService } from 'src/modules/ws-gateway/interface/ws-gateway.interface.service';

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
  id: 2,
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
  getFriends: jest.fn(),
  getFriendInfoByUserIdAndFriendId: jest.fn(),
  getFriendRqeusts: jest.fn(),
  createFriendRequest: jest.fn(),
};

const mockWsGateWayService: Partial<IWsGatewayService> = {
  notifyNewFriend: jest.fn(),
  notifyNewFriendRequest: jest.fn(),
};

describe('UserController', () => {
  let controller: UsersController;
  let envService: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, EnvConfigModule],
      controllers: [UsersController],
      providers: [...usersProviders, UsersService, WsGatewayService],
      exports: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(WsGatewayService)
      .useValue(mockWsGateWayService)
      .compile();

    controller = module.get<UsersController>(UsersController);
    envService = module.get<EnvConfigService>(EnvConfigService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
    let callCount1 = 0;
    let callCount2 = 0;
    (mockUsersService.createFriendRequest as jest.Mock).mockImplementation(
      (from: number) => {
        if (!callCount1 && from === user1.id) {
          callCount1++;
          return pendingRq;
        }
        if (!callCount2 && from === user2.id) {
          callCount2++;
          return acceptRq;
        }
        return null;
      },
    );
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
      1,
    );
    expect(mockWsGateWayService.notifyNewFriendRequest).toHaveBeenCalledWith(
      user2.id,
      pendingRq,
    );

    await controller.postFriendRequest(user2, user2.id, {
      from: user2.id,
      to: user3.id,
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
    (mockUsersService.getById as jest.Mock).mockResolvedValue(user2);
    await controller.getUserById(user2.id);
    expect(mockUsersService.getById).toHaveBeenCalledTimes(1);
    expect(mockUsersService.getById).toHaveBeenCalledWith(user2.id);
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
    const avatarBaseUrl = envService.getAvatarConfig().avatarUrl;
    expect(url).toBe(avatarBaseUrl + '/' + filename);
  });
});
