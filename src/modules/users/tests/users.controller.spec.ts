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

const mockUsersService: Partial<IUsersService> = {
  getById: jest.fn(),
  getFriends: jest.fn(),
  getFriendInfoByUserIdAndFriendId: jest.fn(),
  getFriendRqeusts: jest.fn(),
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
