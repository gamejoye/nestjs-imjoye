import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from 'src/modules/env-config/env-config.service';
import { ChatroomsModule } from '../chatrooms.module';
import { EnvConfigModule } from 'src/modules/env-config/env-config.module';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ResTransformInterceptor } from 'src/common/interceptors/res-transform.interceptors';
import {
  Logger,
  dataForValidIsNumber,
  getChatroomNonExistingId,
  getCurrentDatetime,
  getUserNonExistingId,
  initDatabase,
} from 'src/common/utils';
import { LoginUserRequestDto } from 'src/modules/auth/dto/login.dto';
import { Not, Repository } from 'typeorm';
import { Chatroom } from '../entities/chatroom.entity';
import { DatabaseModule } from 'src/modules/database/database.module';
import { chatroomsProviders } from '../chatrooms.providers';
import {
  CHATROOM_REPOSITORY,
  USER_CHATROOM_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { VisitChatroomDto } from '../dto/visit-chatroom.dto';
import { UserChatroom } from '../entities/user-chatroom.entity';
import { ChatroomVo } from '../vo/chatroom.vo';
import { ChatroomType } from 'src/common/constants/chatroom';
import { GetSingleChatroomDto } from '../dto/get-single-chatroom.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { ChatroomSummaryVo } from '../vo/chatroom-summary.vo';
import { AuthModule } from 'src/modules/auth/auth.module';
import { transformChatroom } from '../vo/utils';

describe('ChatroomController (e2e)', () => {
  let app: INestApplication;
  let envConfigService: EnvConfigService;
  let usersRepository: Repository<User>;
  let chatroomsRepository: Repository<Chatroom>;
  let userChatroomRepository: Repository<UserChatroom>;

  let authorization: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ChatroomsModule, DatabaseModule, EnvConfigModule, AuthModule],
      providers: [...chatroomsProviders],
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

    chatroomsRepository =
      moduleFixture.get<Repository<Chatroom>>(CHATROOM_REPOSITORY);
    userChatroomRepository = moduleFixture.get<Repository<UserChatroom>>(
      USER_CHATROOM_REPOSITORY,
    );
    usersRepository = moduleFixture.get<Repository<User>>(USER_REPOSITORY);
    envConfigService = moduleFixture.get<EnvConfigService>(EnvConfigService);

    /**
     * 登录获取token
     */
    const dto: LoginUserRequestDto = {
      email: 'gamejoye@gmail.com',
      password: '123456..',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto);
    const token = response.body.data.token;
    userId = response.body.data.id;
    authorization = 'Bearer ' + token;
    Logger.test('token:', authorization);
  });

  beforeEach(async () => {
    await initDatabase(envConfigService.getDatabaseConfig());
  });

  afterAll(async () => {
    await app.close();
  });

  it('PUT /chatrooms/:chatroomId/visit with query parameters', async () => {
    const chatrooms = await chatroomsRepository.find();
    expect(chatrooms.length).toBeGreaterThan(0);

    /**
     * 测试OK流程
     */
    for (let i = 0; i < chatrooms.length; i++) {
      const chatroom = chatrooms[i];
      const timestamp = getCurrentDatetime();
      const query: VisitChatroomDto = { timestamp };
      const response = await request(app.getHttpServer())
        .put(`/chatrooms/${chatroom.id}/visit`)
        .query(query)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
      Logger.test(response.body);
    }
    const chatroom = chatrooms[0];

    const query: VisitChatroomDto = { timestamp: getCurrentDatetime() };
    /**
     * 测试BadRequest流程
     */
    // 1. query BadRequest
    const invalidQuery: VisitChatroomDto = { timestamp: 'invalid timestamp' };
    const queryBadRequestResponse = await request(app.getHttpServer())
      .put(`/chatrooms/${chatroom.id}/visit`)
      .query(invalidQuery)
      .set('Authorization', authorization);
    expect(queryBadRequestResponse.status).toBe(HttpStatus.BAD_REQUEST);
    // 2. param BadRequest
    for (const invalidNumber of dataForValidIsNumber) {
      const paramBadRequestResponse = await request(app.getHttpServer())
        .put(`/chatrooms/${invalidNumber}/visit`)
        .query(query)
        .set('Authorization', authorization);
      expect(paramBadRequestResponse.status).toBe(HttpStatus.BAD_REQUEST);
    }

    /**
     * 测试NotFound流程
     */
    const nonExistingId = await getChatroomNonExistingId(chatroomsRepository);
    const notFoundResponse = await request(app.getHttpServer())
      .put(`/chatrooms/${nonExistingId}/visit`)
      .query(query)
      .set('Authorization', authorization);
    expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('GET /chatrooms/:chatroomId', async () => {
    const userChatrooms = await userChatroomRepository.find({
      relations: ['chatroom'],
      where: { user: { id: userId } },
    });
    /**
     * 正常流程
     */
    const chatrooms = userChatrooms.map(({ chatroom }) => chatroom);
    for (const chatroom of chatrooms) {
      const response = await request(app.getHttpServer())
        .get(`/chatrooms/${chatroom.id}`)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
      const chatroomVo = response.body.data as ChatroomVo;
      if (chatroom.type === ChatroomType.SINGLE) {
        const { user: friend } = await userChatroomRepository.findOne({
          where: { chatroom: { id: chatroom.id }, user: { id: Not(userId) } },
          relations: ['user'],
        });
        chatroom.avatarUrl = friend.avatarUrl;
        chatroom.name = friend.username;
      }
      expect(chatroomVo).toMatchObject(transformChatroom(chatroom));
    }

    /**
     * BadRequest流程
     */
    const badRequestResponse = await request(app.getHttpServer())
      .get(`/chatrooms/nonANumber`)
      .set('Authorization', authorization);
    expect(badRequestResponse.status).toBe(HttpStatus.BAD_REQUEST);

    /**
     * NotFound流程
     */
    const nonExsitingId = await getChatroomNonExistingId(chatroomsRepository);
    Logger.test('nonExsitingId', nonExsitingId);
    const notFoundResponse = await request(app.getHttpServer())
      .get(`/chatrooms/${nonExsitingId}`)
      .set('Authorization', authorization);
    expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('GET /chatrooms with query parameters', async () => {
    const userChatrooms = await userChatroomRepository.find({
      relations: ['chatroom', 'user'],
    });
    const chatrooms = userChatrooms
      .filter(
        ({ user, chatroom }) =>
          chatroom.type === ChatroomType.SINGLE && user.id === userId,
      )
      .map(({ chatroom }) => chatroom);
    const chatroomsWithFriendId = userChatrooms
      .filter(
        ({ chatroom: targetChatroom, user }) =>
          user.id !== userId &&
          targetChatroom.type === ChatroomType.SINGLE &&
          chatrooms.find((chatroom) => chatroom.id === targetChatroom.id),
      )
      .map(({ user, chatroom }) => ({ friend: user, chatroom }));
    expect(chatroomsWithFriendId.length).toBeGreaterThan(0);

    /**
     * 测试正常流程
     */
    for (let i = 0; i < chatroomsWithFriendId.length; i++) {
      const { friend, chatroom } = chatroomsWithFriendId[i];
      const query: GetSingleChatroomDto = {
        friend_id: friend.id,
      };
      const response = await request(app.getHttpServer())
        .get(`/chatrooms`)
        .query(query)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
      const chatroomVo: ChatroomVo = response.body.data;
      expect(chatroomVo).toMatchObject(
        transformChatroom({
          ...chatroom,
          name: friend.username,
          avatarUrl: friend.avatarUrl,
        }),
      );
    }

    /**
     * BadRequest流程
     */
    let badQuery: { friend_id: any } = { friend_id: NaN };
    let badRequestResponse = await request(app.getHttpServer())
      .get(`/chatrooms`)
      .query(badQuery)
      .set('Authorization', authorization);
    expect(badRequestResponse.status).toBe(HttpStatus.BAD_REQUEST);

    badQuery = { friend_id: 'nonANumber' };
    badRequestResponse = await request(app.getHttpServer())
      .get(`/chatrooms`)
      .query(badQuery)
      .set('Authorization', authorization);
    expect(badRequestResponse.status).toBe(HttpStatus.BAD_REQUEST);

    /**
     * NonFound流程
     */
    const nonExistingId = await getUserNonExistingId(usersRepository);
    const notFoundQuery: GetSingleChatroomDto = { friend_id: nonExistingId };
    const notFoundResponse = await request(app.getHttpServer())
      .get(`/chatrooms`)
      .query(notFoundQuery)
      .set('Authorization', authorization);
    expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('GET /chatrooms/summaries/:chatroomId', async () => {
    /**
     * 测试正常流程
     */
    const userChatrooms = await userChatroomRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'chatroom'],
    });
    for (const userChatroom of userChatrooms) {
      const chatroom = userChatroom.chatroom;
      let response = await request(app.getHttpServer())
        .get(`/chatrooms/summaries/${chatroom.id}`)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);

      const { user: friend } = await userChatroomRepository.findOne({
        where: { chatroom: { id: chatroom.id }, user: { id: Not(userId) } },
        relations: ['user'],
      });
      const summary: ChatroomSummaryVo = response.body.data;
      if (summary.chatroom.type === ChatroomType.SINGLE) {
        chatroom.name = friend.username;
        chatroom.avatarUrl = friend.avatarUrl;
      }
      expect(summary.chatroom).toMatchObject(transformChatroom(chatroom));
      expect(summary.joinTime).toBe(userChatroom.createTime);
      expect(summary.latestVisitTime).toBe(userChatroom.latestVisitTime);

      response = await request(app.getHttpServer())
        .get(`/chatrooms/summaries/${chatroom.id}`)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
    }

    /**
     * NotFound流程
     */
    const nonExistingId = await getChatroomNonExistingId(chatroomsRepository);
    const notFoundResponse = await request(app.getHttpServer())
      .get(`/chatrooms/summaries/${nonExistingId}`)
      .set('Authorization', authorization);
    expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('GET /chatrooms/summaries', async () => {
    const chatrooms = (
      await userChatroomRepository.find({
        where: { user: { id: userId } },
        relations: ['chatroom'],
      })
    ).map(({ chatroom }) => chatroom);
    const response = await request(app.getHttpServer())
      .get('/chatrooms/summaries')
      .set('Authorization', authorization);
    expect(response.status).toBe(HttpStatus.OK);
    const summaries: Array<ChatroomSummaryVo> = response.body.data;
    chatrooms.sort((chatroom1, chatroom2) => chatroom1.id - chatroom2.id);
    summaries.sort(
      (summary1, summary2) => summary1.chatroom.id - summary2.chatroom.id,
    );
    expect(summaries.length).toBe(chatrooms.length);
    for (let i = 0; i < summaries.length; i++) {
      const summary = summaries[i];
      const chatroom = chatrooms[i];
      const userChatroom = await userChatroomRepository.findOne({
        where: { user: { id: userId }, chatroom: { id: chatroom.id } },
        relations: ['chatroom'],
      });
      if (chatroom.type === ChatroomType.SINGLE) {
        const { user: friend } = await userChatroomRepository.findOne({
          where: { chatroom: { id: chatroom.id }, user: { id: Not(userId) } },
          relations: ['user'],
        });
        chatroom.name = friend.username;
        chatroom.avatarUrl = friend.avatarUrl;
      }
      expect(summary.chatroom).toMatchObject(transformChatroom(chatroom));
      expect(summary.joinTime).toBe(userChatroom.createTime);
      expect(summary.latestVisitTime).toBe(userChatroom.latestVisitTime);
    }
  });

  it('GET /chatrooms/summaries And GET /chatrooms/summaries/:chatroomId shoudle Idenmpotent', async () => {
    const chatrooms = (
      await userChatroomRepository.find({
        where: { user: { id: userId } },
        relations: ['chatroom'],
      })
    ).map(({ chatroom }) => chatroom);
    expect(chatrooms.length).toBeGreaterThan(0);
    const responsesFromGetByChatroomId = await Promise.all(
      chatrooms.map((chatroom) => {
        const response = request(app.getHttpServer())
          .get(`/chatrooms/summaries/${chatroom.id}`)
          .set('Authorization', authorization);
        return response;
      }),
    );
    responsesFromGetByChatroomId.forEach((response) => {
      expect(response.status).toBe(HttpStatus.OK);
    });

    const responseFromGetAll = await request(app.getHttpServer())
      .get('/chatrooms/summaries')
      .set('Authorization', authorization);
    Logger.test('responseFromGetAll body', responseFromGetAll.body);
    Logger.test('responseFromGetAll headers', responseFromGetAll.headers);
    expect(responseFromGetAll.status).toBe(HttpStatus.OK);

    const summariesFromGetByChatroomId =
      responsesFromGetByChatroomId.map<ChatroomSummaryVo>(
        (response) => response.body.data,
      );
    const summariesFromGetAll = responseFromGetAll.body
      .data as Array<ChatroomSummaryVo>;
    summariesFromGetAll.sort(
      (summary1, summary2) => summary1.chatroom.id - summary2.chatroom.id,
    );
    summariesFromGetByChatroomId.sort(
      (summary1, summary2) => summary1.chatroom.id - summary2.chatroom.id,
    );
    expect(summariesFromGetByChatroomId).toMatchObject(summariesFromGetAll);
  });
});
