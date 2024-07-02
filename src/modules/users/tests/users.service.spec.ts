import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { DatabaseModule } from '../../database/database.module';
import { UsersController } from '../users.controller';
import { usersProviders } from '../users.providers';
import { EnvConfigModule } from '../../env-config/env-config.module';
import { EnvConfigService } from 'src/modules/env-config/env-config.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  FRIEND_REQUEST_REPOSITORY,
  USER_FRIENDSHIP_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import {
  getNonExsitingFriendRequest,
  getUserNonExistingEmail,
  getUserNonExistingId,
  initDatabase,
} from 'src/common/utils';
import { UserFriendship } from '../entities/friendship.entity';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FriendRequest } from '../entities/friendrequest.entity';
import { FriendRequestType } from 'src/common/constants/friendrequest';

describe('UserService', () => {
  let service: UsersService;
  let envService: EnvConfigService;
  let usersRepository: Repository<User>;
  let userFriendshipsRepository: Repository<UserFriendship>;
  let friendRequestsRepository: Repository<FriendRequest>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, EnvConfigModule],
      controllers: [UsersController],
      providers: [...usersProviders, UsersService],
      exports: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    envService = module.get<EnvConfigService>(EnvConfigService);
    usersRepository = module.get<Repository<User>>(USER_REPOSITORY);
    userFriendshipsRepository = module.get<Repository<UserFriendship>>(
      USER_FRIENDSHIP_REPOSITORY,
    );
    friendRequestsRepository = module.get<Repository<FriendRequest>>(
      FRIEND_REQUEST_REPOSITORY,
    );
  });

  beforeEach(async () => {
    await initDatabase(envService.getDatabaseConfig());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createFriendRequest work correctly', async () => {
    const ids: [number, number] = await getNonExsitingFriendRequest(
      usersRepository,
      friendRequestsRepository,
    );
    expect(ids).toBeDefined();
    const allCountBeforeInsert = (await friendRequestsRepository.find()).length;

    // 发起好友请求
    const shouldPending = await service.createFriendRequest(ids[0], ids[1]);
    expect(shouldPending).not.toBeNull();
    expect(shouldPending.from.id).toBe(ids[0]);
    expect(shouldPending.to.id).toBe(ids[1]);
    expect(shouldPending.status).toBe(FriendRequestType.PENDING);
    const oldRequestId = shouldPending.id;

    // 重复发起请求 不会再插入新的记录
    const shouldBeNull = await service.createFriendRequest(ids[0], ids[1]);
    expect(shouldBeNull).toBeNull();

    // 互相发送请求 应该直接同意之前的请求
    const shouldAccepted = await service.createFriendRequest(ids[1], ids[0]);
    expect(shouldAccepted).not.toBeNull();
    expect(shouldAccepted.id).toBe(oldRequestId);
    expect(shouldAccepted.status).toBe(FriendRequestType.ACCEPT);

    // 对于已经接受的请求 不会再插入新的记录
    const shouldNull1 = await service.createFriendRequest(ids[1], ids[0]);
    const shouldNull2 = await service.createFriendRequest(ids[0], ids[1]);
    expect(shouldNull1).toBeNull();
    expect(shouldNull2).toBeNull();

    // 如果是拒绝该请求 之后再发送请求 应该再数据库插入新的请求
    await service.updateFriendRequestStatus(
      shouldAccepted.id,
      FriendRequestType.REJECT,
    );
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const newPending = await service.createFriendRequest(ids[0], ids[1]);
    expect(newPending).not.toBeNull();
    expect(newPending.id).not.toEqual(oldRequestId);
    expect(newPending.status).toBe(FriendRequestType.PENDING);

    // 同样的 如果是拒绝请求 后续不管哪一方发送 都应该插入一条新的pending记录
    await friendRequestsRepository.delete({ id: newPending.id });
    const anotherNewPending = await service.createFriendRequest(ids[0], ids[1]);
    expect(anotherNewPending).not.toBeNull();
    expect(anotherNewPending.id).not.toEqual(oldRequestId);
    expect(anotherNewPending.status).toBe(FriendRequestType.PENDING);

    // 应该只插入两条
    const allCountAfterInsert = (await friendRequestsRepository.find()).length;
    expect(allCountAfterInsert).toBe(allCountBeforeInsert + 2);
  });

  it('updateFriendRequestStatus work correctly', async () => {
    const fqs = await friendRequestsRepository.find();
    for (const fq of fqs) {
      let newStatus = fq.status;
      if (newStatus === FriendRequestType.ACCEPT) {
        newStatus = FriendRequestType.PENDING;
      } else if (newStatus === FriendRequestType.PENDING) {
        newStatus = FriendRequestType.REJECT;
      } else {
        newStatus = FriendRequestType.ACCEPT;
      }
      const updated = await service.updateFriendRequestStatus(fq.id, newStatus);
      expect(updated).toMatchObject({ ...fq, status: newStatus });
      const actualFq = await friendRequestsRepository.findOne({
        where: { id: fq.id },
      });
      expect(updated).toMatchObject(actualFq);
    }
  });

  it('getFriendRequests work correctly', async () => {
    const requestSorter = (fq1: FriendRequest, fq2: FriendRequest) => {
      const t1 = new Date(fq1.createTime).getTime();
      const t2 = new Date(fq2.createTime).getTime();
      if (t1 === t2) return fq1.id - fq2.id;
      return t1 - t2;
    };
    const users = await usersRepository.find();
    for (const user of users) {
      const allRequests = await friendRequestsRepository.find({
        relations: ['from', 'to'],
      });
      const actualRequests = allRequests
        .filter(({ from, to }) => from.id === user.id || to.id === user.id)
        .sort(requestSorter);
      const requests = await service.getFriendRqeusts(user.id);
      for (let i = 0; i < requests.length - 1; i++) {
        const rq1 = requests[i];
        const rq2 = requests[i + 1];
        const t1 = new Date(rq1.createTime).getTime();
        const t2 = new Date(rq2.createTime).getTime();
        expect(t1).toBeGreaterThanOrEqual(t2);
      }
      requests.sort(requestSorter);
      expect(requests).toMatchObject(actualRequests);
    }
  });

  it('getByEmail work correctly', async () => {
    const users = await usersRepository.find();
    const usersGetByService = await Promise.all(
      users.map((user) => service.getByEmail(user.email)),
    );
    expect(users).toMatchObject(usersGetByService);
    const userNonExistingEmail = await getUserNonExistingEmail(usersRepository);
    const userNonExisting = await service.getByEmail(userNonExistingEmail);
    expect(userNonExisting).toBeNull();
  });

  it('getById work correctly', async () => {
    const users = await usersRepository.find();
    const usersGetByService = await Promise.all(
      users.map((user) => service.getById(user.id)),
    );
    expect(users).toMatchObject(usersGetByService);
    const nonExistingUserId = await getUserNonExistingId(usersRepository);
    const userNonExisting = await service.getById(nonExistingUserId);
    expect(userNonExisting).toBeNull();
  });

  it('register work correctly', async () => {
    const username = 'useruseruser';
    const email = await getUserNonExistingEmail(usersRepository);
    const password = '123456..';
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarUrl = 'avatar url';

    const userNonExisting = await usersRepository.findOne({
      where: { email: email },
    });
    expect(userNonExisting).toBeNull();

    const user = await service.register(
      username,
      email,
      passwordHash,
      avatarUrl,
    );
    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
    expect(user.passwordHash).toBe(passwordHash);
    expect(user.avatarUrl).toBe(avatarUrl);

    const userByEmail = await usersRepository.findOne({
      where: { email: email },
    });
    expect(userByEmail).toMatchObject(user);

    /**
     * 异常逻辑
     */
    expect(
      service.register(username, email, passwordHash, avatarUrl),
    ).rejects.toThrow();
  });

  it('getFriends work correctly', async () => {
    const userSorter = (user1: User, user2: User) => user1.id - user2.id;
    const users = await usersRepository.find();
    for (const user of users) {
      const friendshipsUserSend = await userFriendshipsRepository.find({
        where: { from: { id: user.id } },
        relations: ['to'],
      });
      const friendshipsUserReceive = await userFriendshipsRepository.find({
        where: { to: { id: user.id } },
        relations: ['from'],
      });
      const friends = [
        ...friendshipsUserSend.map((friendship) => friendship.to),
        ...friendshipsUserReceive.map((friendship) => friendship.from),
      ].sort(userSorter);

      const friendsGetByService = (await service.getFriends(user.id)).sort(
        userSorter,
      );
      expect(friendsGetByService).toMatchObject(friends);
      expect(friends).toMatchObject(friendsGetByService);
    }
  });

  it('getFriendInfoByUserIdAndFriendId work correctly', async () => {
    const friendships = await userFriendshipsRepository.find({
      relations: ['from', 'to'],
    });
    /**
     * 正常逻辑
     */
    for (const friendship of friendships) {
      const { from, to } = friendship;
      const friendInfoByFrom = await service.getFriendInfoByUserIdAndFriendId(
        from.id,
        to.id,
      );
      expect(friendInfoByFrom.user).toMatchObject(to);
      expect(friendInfoByFrom.createTime).toBe(friendship.createTime);

      const friendInfoByTo = await service.getFriendInfoByUserIdAndFriendId(
        to.id,
        from.id,
      );
      expect(friendInfoByTo.user).toMatchObject(from);
      expect(friendInfoByTo.createTime).toBe(friendship.createTime);
    }

    /**
     * 异常逻辑
     */
    const nonExistingUserId = await getUserNonExistingId(usersRepository);
    const users = await usersRepository.find();
    for (const user of users) {
      await service
        .getFriendInfoByUserIdAndFriendId(user.id, nonExistingUserId)
        .then(() => {
          expect(true).toBe(false);
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(HttpException);
          expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        });
      await service
        .getFriendInfoByUserIdAndFriendId(nonExistingUserId, user.id)
        .then(() => {
          expect(true).toBe(false);
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(HttpException);
          expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        });
    }
  });
});
