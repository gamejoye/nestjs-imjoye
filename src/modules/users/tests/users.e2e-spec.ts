import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from 'src/modules/env-config/env-config.service';
import { User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { DatabaseModule } from 'src/modules/database/database.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ResTransformInterceptor } from 'src/common/interceptors/res-transform.interceptors';
import {
  FRIEND_REQUEST_REPOSITORY,
  USER_FRIENDSHIP_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { LoginUserRequestDto } from 'src/modules/auth/dto/login.dto';
import { dataForValidIsNumber, initDatabase } from 'src/common/utils';
import { EnvConfigModule } from 'src/modules/env-config/env-config.module';
import { usersProviders } from '../users.providers';
import { UserFriendship } from '../entities/friendship.entity';
import {
  transformFriendRequest,
  transformUser,
} from '../vo/utils/user-transform';
import { UserVo } from '../vo/user.vo';
import { FriendInfoVo } from '../vo/friend-info.vo';
import { FriendRequest } from '../entities/friendrequest.entity';
import { FriendRequestVo } from '../vo/friendrequest.vo';

const userSorter = (user1: User, user2: User) => user1.id - user2.id;
const descRequestSorter = (fq1: FriendRequest, fq2: FriendRequest) => {
  const t1 = new Date(fq1.createTime).getTime();
  const t2 = new Date(fq2.createTime).getTime();
  if (t1 === t2) return fq2.id - fq1.id;
  return t2 - t1;
};

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let envConfigService: EnvConfigService;
  let usersRepository: Repository<User>;
  let userFriendshipsRepository: Repository<UserFriendship>;
  let friendRequestsRepository: Repository<FriendRequest>;

  let authorizations: Map<number, string>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, DatabaseModule, EnvConfigModule, AuthModule],
      providers: [...usersProviders],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        validateCustomDecorators: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResTransformInterceptor());
    await app.init();

    usersRepository = moduleFixture.get<Repository<User>>(USER_REPOSITORY);
    userFriendshipsRepository = moduleFixture.get<Repository<UserFriendship>>(
      USER_FRIENDSHIP_REPOSITORY,
    );
    friendRequestsRepository = moduleFixture.get<Repository<FriendRequest>>(
      FRIEND_REQUEST_REPOSITORY,
    );
    envConfigService = moduleFixture.get<EnvConfigService>(EnvConfigService);

    /**
     * 登录获取token
     */
    const users = await usersRepository.find();
    authorizations = new Map();
    for (const user of users) {
      const dto: LoginUserRequestDto = {
        email: user.email,
        password: '123456..',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(dto);
      const token = response.body.data.token;
      const userId = response.body.data.id;
      const authorization = 'Bearer ' + token;
      authorizations.set(userId, authorization);
    }
  });

  function getAuthorization(userId: number): string {
    return authorizations.get(userId);
  }

  beforeEach(async () => {
    await initDatabase(envConfigService.getDatabaseConfig());
  });

  afterAll(async () => {
    await initDatabase(envConfigService.getDatabaseConfig());
    await app.close();
  });

  it('GET /users/:id/friends/requests', async () => {
    const users = await usersRepository.find();
    const allFqs = (
      await friendRequestsRepository.find({
        relations: ['from', 'to'],
      })
    ).sort(descRequestSorter);
    for (const user of users) {
      const authorization = getAuthorization(user.id);
      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}/friends/requests`)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
      const fqVoss = allFqs
        .filter((fq) => fq.from.id === user.id || fq.to.id === user.id)
        .map((fq) => transformFriendRequest(fq));
      const fqVos = response.body.data as Array<FriendRequestVo>;
      for (let i = 0; i < fqVos.length - 1; i++) {
        const vo1 = fqVos[i];
        const vo2 = fqVos[i + 1];
        expect(new Date(vo1.createTime).getTime()).toBeGreaterThanOrEqual(
          new Date(vo2.createTime).getTime(),
        );
      }
      expect(response.body.data).toMatchObject(fqVoss);
    }
  });

  it('GET /users/:id', async () => {
    /**
     * 正常逻辑
     */
    const users = await usersRepository.find();
    for (const user of users) {
      const authorization = getAuthorization(user.id);
      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject(transformUser(user));
    }

    /**
     * Unauthorized逻辑
     */
    const unauthorizedResponse = await request(app.getHttpServer()).get(
      `/users/${users[0].id}`,
    );
    expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);

    /**
     * BadReqeust逻辑
     */
    const user = (await usersRepository.find()).at(0);
    const authorization = getAuthorization(user.id);
    for (const invalidNumber of dataForValidIsNumber) {
      const badRequestrRes = await request(app.getHttpServer())
        .get(`/users/${invalidNumber}`)
        .set('Authorization', authorization);
      expect(badRequestrRes.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  it('GET /users/:id/friends', async () => {
    /**
     * 正常流程
     */
    const users = await usersRepository.find();
    for (const user of users) {
      const userId = user.id;
      const authorization = getAuthorization(userId);
      const friendsUserSend = (
        await userFriendshipsRepository.find({
          where: { from: { id: userId } },
          relations: ['to'],
        })
      ).map(({ to }) => to);
      const friendsUserReceive = (
        await userFriendshipsRepository.find({
          where: { to: { id: userId } },
          relations: ['from'],
        })
      ).map(({ from }) => from);
      const friends = [...friendsUserSend, ...friendsUserReceive].sort(
        userSorter,
      );

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}/friends`)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
      const friendVos = (response.body.data as Array<UserVo>).sort(userSorter);
      expect(friendVos).toMatchObject(
        friends.map((friend) => transformUser(friend)),
      );

      /**
       * Unauthorized流程
       */
      const unauthorizedResponse = await request(app.getHttpServer()).get(
        `/users/${user.id}/friends`,
      );
      expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);

      /**
       * Forbidden流程
       */
      const users = await usersRepository.find();
      const other = users.find((other) => other.id !== userId);
      const forbiddenResponse = await request(app.getHttpServer())
        .get(`/users/${other.id}/friends`)
        .set('Authorization', authorization);
      expect(forbiddenResponse.status).toBe(HttpStatus.FORBIDDEN);

      /**
       * BadReqeust逻辑
       */
      for (const invalidNumber of dataForValidIsNumber) {
        const badRequestrRes = await request(app.getHttpServer())
          .get(`/users/${invalidNumber}/friends`)
          .set('Authorization', authorization);
        expect(badRequestrRes.status).toBe(HttpStatus.BAD_REQUEST);
      }
    }
  });

  it('GET /users/:id/friends/:friendId', async () => {
    const users = await usersRepository.find();
    for (const user of users) {
      const userId = user.id;
      const authorization = getAuthorization(userId);
      const friendsUserSend = (
        await userFriendshipsRepository.find({
          where: { from: { id: userId } },
          relations: ['to'],
        })
      ).map(({ to }) => to);
      const friendsUserReceive = (
        await userFriendshipsRepository.find({
          where: { to: { id: userId } },
          relations: ['from'],
        })
      ).map(({ from }) => from);
      const friends = [...friendsUserSend, ...friendsUserReceive].sort(
        userSorter,
      );
      /**
       * 正常流程
       */
      for (const friend of friends) {
        const response = await request(app.getHttpServer())
          .get(`/users/${user.id}/friends/${friend.id}`)
          .set('Authorization', authorization);
        expect(response.status).toBe(HttpStatus.OK);
        const friendInfoVo = response.body.data as FriendInfoVo;
        expect(friendInfoVo.user).toMatchObject(transformUser(friend));
        const userFriendship =
          (await userFriendshipsRepository.findOne({
            where: { from: { id: user.id }, to: { id: friend.id } },
          })) ||
          (await userFriendshipsRepository.findOne({
            where: { from: { id: friend.id }, to: { id: user.id } },
          }));
        expect(friendInfoVo.createTime).toBe(userFriendship.createTime);
      }

      if (friends.length === 0) continue;
      /**
       * Unauthorized流程
       */
      const unauthorizedResponse = await request(app.getHttpServer()).get(
        `/users/${user.id}/friends/${friends[0].id}`,
      );
      expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);

      /**
       * Forbidden流程
       */
      const users = await usersRepository.find();
      const other = users.find((other) => other.id !== userId);
      const forbiddenResponse = await request(app.getHttpServer())
        .get(`/users/${other.id}/friends/${friends[0].id}`)
        .set('Authorization', authorization);
      expect(forbiddenResponse.status).toBe(HttpStatus.FORBIDDEN);

      /**
       * BadRequest流程
       */
      for (const invalidNumber of dataForValidIsNumber) {
        const userIdBadRequestRes = await request(app.getHttpServer())
          .get(`/users/${invalidNumber}/friends/${friends[0].id}`)
          .set('Authorization', authorization);
        expect(userIdBadRequestRes.status).toBe(HttpStatus.BAD_REQUEST);
        const friendIdBadRequestRes = await request(app.getHttpServer())
          .get(`/users/${user.id}/friends/${invalidNumber}`)
          .set('Authorization', authorization);
        expect(friendIdBadRequestRes.status).toBe(HttpStatus.BAD_REQUEST);
      }
    }
  });

  it('POST /users/avatar/upload', async () => {
    const users = await usersRepository.find();
    for (const user of users) {
      const authorization = getAuthorization(user.id);
      const totalImages = 2;
      for (let i = 0; i < totalImages; i++) {
        const response = await request(app.getHttpServer())
          .post('/users/avatar/upload')
          .set('Authorization', authorization)
          .attach('file', `test/images/image${i}.jpg`);
        expect(response.status).toBe(HttpStatus.CREATED);
      }
      const totalOversizeImages = 2;
      for (let i = 0; i < totalOversizeImages; i++) {
        const response = await request(app.getHttpServer())
          .post('/users/avatar/upload')
          .set('Authorization', authorization)
          .attach('file', `test/oversize-images/image${i}.jpg`);
        expect(response.status).toBe(HttpStatus.PAYLOAD_TOO_LARGE);
      }
    }
  });
});
