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
  USER_FRIENDSHIP_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import {
  getUserNonExistingEmail,
  getUserNonExistingId,
  initDatabase,
} from 'src/common/utils';
import { UserFriendship } from '../entities/friendship.entity';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let service: UsersService;
  let envService: EnvConfigService;
  let usersRepository: Repository<User>;
  let userFriendshipsRepository: Repository<UserFriendship>;

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
  });

  beforeEach(async () => {
    await initDatabase(envService.getDatabaseConfig());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
