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
import * as jwt from 'jsonwebtoken';
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
  let authorizations: Map<number, string>;

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

    authorizations = new Map();
    const users = await usersRepository.find();
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
      const uc = await userChatroomRepository.findOne({
        where: { chatroom: { id: chatroom.id } },
        relations: ['user'],
      });
      const authorization = getAuthorization(uc.user.id);
      const response = await request(app.getHttpServer())
        .put(`/chatrooms/${chatroom.id}/visit`)
        .query(query)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
    }
    const chatroom = chatrooms[0];
    const uc = await userChatroomRepository.findOne({
      where: { chatroom: { id: chatroom.id } },
      relations: ['user'],
    });
    const authorization = getAuthorization(uc.user.id);

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
    /**
     * 正常流程
     */
    const chatrooms = await chatroomsRepository.find();
    const chatroomToUser = new Map<number, [Chatroom, User, string]>();
    const ucs = await userChatroomRepository.find({
      relations: ['chatroom', 'user'],
    });
    for (const { chatroom, user } of ucs) {
      if (!chatroomToUser.has(chatroom.id)) {
        const authorization = getAuthorization(user.id);
        chatroomToUser.set(chatroom.id, [chatroom, user, authorization]);
      }
    }
    for (const chatroom of chatrooms) {
      const user = chatroomToUser.get(chatroom.id)[1];
      const authorization = chatroomToUser.get(chatroom.id)[2];
      const response = await request(app.getHttpServer())
        .get(`/chatrooms/${chatroom.id}`)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
      const chatroomVo = response.body.data as ChatroomVo;
      if (chatroom.type === ChatroomType.SINGLE) {
        const { user: friend } = await userChatroomRepository.findOne({
          where: { chatroom: { id: chatroom.id }, user: { id: Not(user.id) } },
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
    const authorization = [...chatroomToUser.entries()][0][1][2];
    const badRequestResponse = await request(app.getHttpServer())
      .get(`/chatrooms/nonANumber`)
      .set('Authorization', authorization);
    expect(badRequestResponse.status).toBe(HttpStatus.BAD_REQUEST);

    /**
     * NotFound流程
     */
    const nonExsitingId = await getChatroomNonExistingId(chatroomsRepository);
    const notFoundResponse = await request(app.getHttpServer())
      .get(`/chatrooms/${nonExsitingId}`)
      .set('Authorization', authorization);
    expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('GET /chatrooms with query parameters', async () => {
    const chatrooms = await chatroomsRepository.find({
      where: { type: ChatroomType.SINGLE },
    });

    for (const chatroom of chatrooms) {
      const users = (
        await userChatroomRepository.find({
          where: {
            chatroom: { id: chatroom.id },
          },
          relations: ['user'],
        })
      ).map(({ user }) => user);
      expect(users.length).toBe(2);
      const authorization = getAuthorization(users[0].id);
      const friend = users[1];
      const query: GetSingleChatroomDto = {
        friend_id: friend.id,
      };
      /**
       * 测试正常流程
       */
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
    }
  });

  it('GET /chatrooms/summaries/:chatroomId', async () => {
    /**
     * 测试正常流程
     */
    const userChatrooms = await userChatroomRepository.find({
      relations: ['user', 'chatroom'],
    });
    for (const userChatroom of userChatrooms) {
      const userId = userChatroom.user.id;
      const authorization = getAuthorization(userId);
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
    const user = (await usersRepository.find()).at(0);
    const authorization = getAuthorization(user.id);
    const nonExistingId = await getChatroomNonExistingId(chatroomsRepository);
    const notFoundResponse = await request(app.getHttpServer())
      .get(`/chatrooms/summaries/${nonExistingId}`)
      .set('Authorization', authorization);
    expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('GET /chatrooms/summaries', async () => {
    const users = await usersRepository.find();
    for (const user of users) {
      const userId = user.id;
      const authorization = getAuthorization(userId);
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
    }
  });

  it('GET /chatrooms/summaries And GET /chatrooms/summaries/:chatroomId shoudle Idenmpotent', async () => {
    const users = await usersRepository.find();
    for (const user of users) {
      const userId = user.id;
      const authorization = getAuthorization(userId);
      const chatrooms = (
        await userChatroomRepository.find({
          where: { user: { id: userId } },
          relations: ['chatroom'],
        })
      ).map(({ chatroom }) => chatroom);
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
    }
  });
});
