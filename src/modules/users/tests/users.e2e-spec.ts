import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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
import {
  dataForValidIsNumber,
  getNonExsitingFriendRequest,
  getUserNonExistingEmail,
  getUserNonExistingId,
  initDatabase,
} from 'src/common/utils';
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
import { FriendRequestType } from 'src/common/constants/friendrequest';
import { PostFriendRequestDto } from '../dto/post-friend-request.dto';
import { ChatroomsModule } from 'src/modules/chatrooms/chatrooms.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { Config } from 'src/config/configuration';

const userSorter = (user1: User, user2: User) => user1.id - user2.id;
const descRequestSorter = (fq1: FriendRequest, fq2: FriendRequest) => {
  const t1 = new Date(fq1.createTime).getTime();
  const t2 = new Date(fq2.createTime).getTime();
  if (t1 === t2) return fq2.id - fq1.id;
  return t2 - t1;
};

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let usersRepository: Repository<User>;
  let userFriendshipsRepository: Repository<UserFriendship>;
  let friendRequestsRepository: Repository<FriendRequest>;

  let authorizations: Map<number, string>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        DatabaseModule,
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          load: [configuration],
          isGlobal: true,
        }),
        AuthModule,
        ChatroomsModule,
      ],
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
    configService = moduleFixture.get<ConfigService>(ConfigService);

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
    await initDatabase(configService.get<Config['database']>('database'));
  });

  afterAll(async () => {
    await initDatabase(configService.get<Config['database']>('database'));
    await app.close();
  });

  it('GET /users?email=', async () => {
    const users = await usersRepository.find();
    for (const user of users) {
      const response = await request(app.getHttpServer()).get(
        `/users?email=${user.email}`,
      );
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject(transformUser(user));
    }
    const badRequestResponse = await request(app.getHttpServer()).get(
      `/users?email=123`,
    );
    expect(badRequestResponse.status).toBe(HttpStatus.BAD_REQUEST);
    const nonExistingEmail = await getUserNonExistingEmail(usersRepository);
    const notFoundResponse = await request(app.getHttpServer()).get(
      `/users?email=${nonExistingEmail}`,
    );
    expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('PUT /users/:id/friends/requests/:requestId/accept', async () => {
    const ids = await getNonExsitingFriendRequest(
      usersRepository,
      friendRequestsRepository,
    );
    const fromAuthorization = getAuthorization(ids[0]);
    const postDto: PostFriendRequestDto = { from: ids[0], to: ids[1] };
    const postResponse = await request(app.getHttpServer())
      .post(`/users/${ids[0]}/friends/requests`)
      .set('Authorization', fromAuthorization)
      .send(postDto);
    expect(postResponse.status).toBe(HttpStatus.CREATED);
    const fq = postResponse.body.data as FriendRequestVo;

    // Forbbiden流程
    // 1. 只有接受者能同意请求
    const forbbidenResponse = await request(app.getHttpServer())
      .put(`/users/${ids[0]}/friends/requests/${fq.id}/accept`)
      .set('Authorization', fromAuthorization);
    expect(forbbidenResponse.status).toBe(HttpStatus.FORBIDDEN);
    expect(forbbidenResponse.body.message).toBe('权限不足');

    const toAuthorization = getAuthorization(ids[1]);
    // 2. 用户认证信息不正确
    const forbbidenTokenResponse = await request(app.getHttpServer())
      .put(`/users/${ids[0]}/friends/requests/${fq.id}/accept`)
      .set('Authorization', toAuthorization);
    expect(forbbidenTokenResponse.status).toBe(HttpStatus.FORBIDDEN);
    expect(forbbidenTokenResponse.body.message).toBe('权限不足');

    // Unauthorized
    const unauthorizedResponse = await request(app.getHttpServer()).put(
      `/users/${ids[1]}/friends/requests/${fq.id}/accept`,
    );
    expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);

    // 正常流程
    const putResponse = await request(app.getHttpServer())
      .put(`/users/${ids[1]}/friends/requests/${fq.id}/accept`)
      .set('Authorization', toAuthorization);
    expect(putResponse.status).toBe(HttpStatus.OK);
    expect((putResponse.body.data as FriendRequestVo).status).toBe(
      FriendRequestType.ACCEPT,
    );
  });

  it('PUT /users/:id/friends/requests/:requestId/reject', async () => {
    const ids = await getNonExsitingFriendRequest(
      usersRepository,
      friendRequestsRepository,
    );
    const fromAuthorization = getAuthorization(ids[0]);
    const postDto: PostFriendRequestDto = { from: ids[0], to: ids[1] };
    const postResponse = await request(app.getHttpServer())
      .post(`/users/${ids[0]}/friends/requests`)
      .set('Authorization', fromAuthorization)
      .send(postDto);
    expect(postResponse.status).toBe(HttpStatus.CREATED);
    const fq = postResponse.body.data as FriendRequestVo;

    // Forbbiden流程
    // 1. 只有接受者能拒绝请求
    const forbbidenResponse = await request(app.getHttpServer())
      .put(`/users/${ids[0]}/friends/requests/${fq.id}/reject`)
      .set('Authorization', fromAuthorization);
    expect(forbbidenResponse.status).toBe(HttpStatus.FORBIDDEN);
    expect(forbbidenResponse.body.message).toBe('权限不足');

    const toAuthorization = getAuthorization(ids[1]);
    // 2. 用户认证信息不正确
    const forbbidenTokenResponse = await request(app.getHttpServer())
      .put(`/users/${ids[0]}/friends/requests/${fq.id}/reject`)
      .set('Authorization', toAuthorization);
    expect(forbbidenTokenResponse.status).toBe(HttpStatus.FORBIDDEN);
    expect(forbbidenTokenResponse.body.message).toBe('权限不足');

    // Unauthorized
    const unauthorizedResponse = await request(app.getHttpServer()).put(
      `/users/${ids[1]}/friends/requests/${fq.id}/reject`,
    );
    expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);

    // 正常流程
    const putResponse = await request(app.getHttpServer())
      .put(`/users/${ids[1]}/friends/requests/${fq.id}/reject`)
      .set('Authorization', toAuthorization);
    expect(putResponse.status).toBe(HttpStatus.OK);
    expect((putResponse.body.data as FriendRequestVo).status).toBe(
      FriendRequestType.REJECT,
    );
  });

  it('POST /users/:id/friends/requests', async () => {
    const users = await usersRepository.find();
    const acceptFqs = await friendRequestsRepository.find({
      where: { status: FriendRequestType.ACCEPT },
      relations: ['from', 'to'],
    });
    for (const accept of acceptFqs) {
      const { from, to } = accept;
      const authorization = getAuthorization(from.id);
      const dto: PostFriendRequestDto = {
        from: from.id,
        to: to.id,
      };
      const conflictResponse = await request(app.getHttpServer())
        .post(`/users/${from.id}/friends/requests`)
        .set('Authorization', authorization)
        .send(dto);
      expect(conflictResponse.status).toBe(HttpStatus.CONFLICT);

      const unauthorizedResponse = await request(app.getHttpServer())
        .post(`/users/${from.id}/friends/requests`)
        .send(dto);
      expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);

      const forbiddenResponse = await request(app.getHttpServer())
        .post(`/users/${to.id}/friends/requests`)
        .set('Authorization', authorization)
        .send(dto);
      expect(forbiddenResponse.status).toBe(HttpStatus.FORBIDDEN);
    }
    for (const user of users) {
      const authorization = getAuthorization(user.id);
      let toId = -1;
      for (const toUser of users) {
        if (user.id === toUser.id) continue;
        let existing = await friendRequestsRepository.findOne({
          where: {
            from: { id: user.id },
            to: { id: toUser.id },
          },
        });
        if (!existing) {
          existing = await friendRequestsRepository.findOne({
            where: {
              to: { id: user.id },
              from: { id: toUser.id },
            },
          });
        }
        if (!existing) {
          toId = toUser.id;
          break;
        }
      }
      if (toId === -1) continue;
      const dto: PostFriendRequestDto = {
        from: user.id,
        to: toId,
      };
      const response = await request(app.getHttpServer())
        .post(`/users/${user.id}/friends/requests`)
        .set('Authorization', authorization)
        .send(dto);
      expect(response.status).toBe(HttpStatus.CREATED);
      const fq = response.body.data as FriendRequestVo;
      expect(fq.status).toBe(FriendRequestType.PENDING);
    }
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
      const response = await request(app.getHttpServer()).get(
        `/users/${user.id}`,
      );
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject(transformUser(user));
    }

    /**
     * NotFound逻辑
     */
    const unknowId = await getUserNonExistingId(usersRepository);
    const notFoundResponse = await request(app.getHttpServer()).get(
      `/users/${unknowId}`,
    );
    expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);

    /**
     * BadReqeust逻辑
     */
    for (const invalidNumber of dataForValidIsNumber) {
      const badRequestrRes = await request(app.getHttpServer()).get(
        `/users/${invalidNumber}`,
      );
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
