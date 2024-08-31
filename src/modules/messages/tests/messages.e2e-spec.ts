import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chatroom } from 'src/modules/chatrooms/entities/chatroom.entity';
import { UserChatroom } from 'src/modules/chatrooms/entities/user-chatroom.entity';
import { User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { MessagesModule } from '../messages.module';
import { DatabaseModule } from 'src/modules/database/database.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { messagesProviders } from '../messages.providers';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ResTransformInterceptor } from 'src/common/interceptors/res-transform.interceptors';
import {
  CHATROOM_REPOSITORY,
  MESSAGE_REPOSITORY,
  USER_CHATROOM_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { LoginUserRequestDto } from 'src/modules/auth/dto/login.dto';
import {
  getChatroomNonExistingId,
  getNonExistingUserChatroom,
  getUserNonExistingId,
  initDatabase,
} from 'src/common/utils';
import { Message } from '../entities/message.entity';
import { GetMessagesByChatroomIdDto } from '../dto/get-messages-by-chatroom-id.dto';
import { IAddMessageDto } from '../dto/add-message.dto';
import { transformMessage } from '../vo/utils';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { Config } from 'src/config/configuration';
import { BasePaging } from 'src/common/types/base.dto';
import { PagingMessagesVo } from '../vo/pagine-messages.vo';

describe('ChatroomController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let messagesRepository: Repository<Message>;
  let usersRepository: Repository<User>;
  let chatroomsRepository: Repository<Chatroom>;
  let userChatroomRepository: Repository<UserChatroom>;
  let authorizations: Map<number, string>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MessagesModule,
        DatabaseModule,
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          load: [configuration],
          isGlobal: true,
        }),
        AuthModule,
      ],
      providers: [...messagesProviders],
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

    messagesRepository =
      moduleFixture.get<Repository<Message>>(MESSAGE_REPOSITORY);
    chatroomsRepository =
      moduleFixture.get<Repository<Chatroom>>(CHATROOM_REPOSITORY);
    userChatroomRepository = moduleFixture.get<Repository<UserChatroom>>(
      USER_CHATROOM_REPOSITORY,
    );
    usersRepository = moduleFixture.get<Repository<User>>(USER_REPOSITORY);
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

  it('GET /messages with some parameters', async () => {
    const messageSorter = (msg1: Message, msg2: Message) => {
      return msg2.id - msg1.id;
    };
    const paging: BasePaging = {
      _start: 1,
      _end: 11,
      _order: 'DESC',
      _sort: 'id',
    };
    /**
     * 正常流程
     */
    const chatrooms = await chatroomsRepository.find();
    for (const chatroom of chatrooms) {
      const uc = await userChatroomRepository.findOne({
        where: { chatroom: { id: chatroom.id } },
        relations: ['user'],
      });
      const userId = uc.user.id;
      const authorization = getAuthorization(userId);
      const query: GetMessagesByChatroomIdDto = {
        room_id: chatroom.id,
      };
      const response = await request(app.getHttpServer())
        .get(`/messages`)
        .query({ ...query, ...paging })
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
      const { total, messages: messageVos }: PagingMessagesVo =
        response.body.data;
      for (let i = 0; i < messageVos.length - 1; i++) {
        const vo1 = messageVos[i];
        const vo2 = messageVos[i + 1];
        expect(vo1.id).toBeGreaterThanOrEqual(vo2.id);
      }
      expect(messageVos.length).toBe(
        Math.min(paging._end, total) - paging._start,
      );
      const messages = await messagesRepository.find({
        where: { chatroom: { id: chatroom.id } },
        relations: ['from', 'chatroom'],
        order: {
          id: 'DESC',
        },
        skip: paging._start,
        take: paging._end - paging._start,
      });
      expect(
        messages.map((message) => transformMessage(message)),
      ).toMatchObject(messageVos);
    }

    const user = (await usersRepository.find()).at(0);
    const authorization = getAuthorization(user.id);
    /**
     * NotFound流程
     */
    // 1. chatroom不存在的NotFound
    const nonExisintChatroomId =
      await getChatroomNonExistingId(chatroomsRepository);
    const notFoundQuery: GetMessagesByChatroomIdDto = {
      room_id: nonExisintChatroomId,
    };
    const notFoundResponse = await request(app.getHttpServer())
      .get(`/messages`)
      .query({ ...notFoundQuery, ...paging })
      .set('Authorization', authorization);
    expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);
    // 2. user不在chatroom的NotFound
    const nonExistingUserChatrooms = await getNonExistingUserChatroom(
      usersRepository,
      chatroomsRepository,
      userChatroomRepository,
    );
    expect(nonExistingUserChatrooms.length).toBeGreaterThan(0);
    for (const { userId, chatroomId } of nonExistingUserChatrooms) {
      const dto: GetMessagesByChatroomIdDto = { room_id: chatroomId };
      const authorization = getAuthorization(userId);
      const notFoundResponse = await request(app.getHttpServer())
        .get(`/messages`)
        .query({ ...dto, ...paging })
        .set('Authorization', authorization);
      expect(notFoundResponse.status).toBe(HttpStatus.NOT_FOUND);
    }

    /**
     * BadRequest流程
     */
    const badRoomIds = ['', 'not a Number', NaN, undefined, null];
    for (const badRoomId of badRoomIds) {
      const badQuery = { room_id: badRoomId };
      const badRequestResponse = await request(app.getHttpServer())
        .get(`/messages`)
        .query({ ...badQuery, ...paging })
        .set('Authorization', authorization);
      expect(badRequestResponse.status).toBe(HttpStatus.BAD_REQUEST);
    }

    /**
     * 未认证流程
     */
    const query: GetMessagesByChatroomIdDto = { room_id: 1 };
    const unauthorizedResponse = await request(app.getHttpServer())
      .get(`/messages`)
      .query({ ...query, ...paging });
    expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('POST /messages', async () => {
    const ucs = await userChatroomRepository.find({
      relations: ['user', 'chatroom'],
    });
    for (const { user, chatroom } of ucs) {
      /**
       * 正常流程
       */
      const authorization = getAuthorization(user.id);
      const dto: IAddMessageDto = {
        temporaryId: -1,
        chatroom: { id: chatroom.id },
        from: { id: user.id },
        content: 'test content',
      };
      const response = await request(app.getHttpServer())
        .post(`/messages`)
        .set('Authorization', authorization)
        .send(dto);
      expect(response.status).toBe(HttpStatus.CREATED);
      const message: Message = response.body.data;
      expect(message.content).toBe(dto.content);
      expect(message.temporaryId).toBe(dto.temporaryId);
      expect(message.from.id).toBe(dto.from.id);
      expect(message.chatroom.id).toBe(dto.chatroom.id);

      /**
       * NotFound流程
       */
      // 1. chatroom not found
      const nonExisintChatroomid =
        await getChatroomNonExistingId(chatroomsRepository);
      const chatroomNotFoundDto: IAddMessageDto = {
        ...dto,
        chatroom: { id: nonExisintChatroomid },
      };
      const chatroomNotFonudResponse = await request(app.getHttpServer())
        .post(`/messages`)
        .set('Authorization', authorization)
        .send(chatroomNotFoundDto);
      expect(chatroomNotFonudResponse.status).toBe(HttpStatus.NOT_FOUND);
      // 2. user not found
      const nonExisintUsreId = await getUserNonExistingId(usersRepository);
      const userNotFoundDto: IAddMessageDto = {
        ...dto,
        from: { id: nonExisintUsreId },
      };
      const userNotFoundResponse = await request(app.getHttpServer())
        .post(`/messages`)
        .set('Authorization', authorization)
        .send(userNotFoundDto);
      expect(userNotFoundResponse.status).toBe(HttpStatus.NOT_FOUND);

      /**
       * Forbidden流程
       */
      const nonExistingUserChatrooms = await getNonExistingUserChatroom(
        usersRepository,
        chatroomsRepository,
        userChatroomRepository,
      );
      expect(nonExistingUserChatrooms.length).toBeGreaterThan(0);
      const nonExistingUserChatroom = nonExistingUserChatrooms[0];
      const { userId, chatroomId } = nonExistingUserChatroom;
      const forbiddentDto: IAddMessageDto = {
        temporaryId: -1,
        chatroom: { id: chatroomId },
        from: { id: userId },
        content: 'test content',
      };
      const forbiddenResponse = await request(app.getHttpServer())
        .post(`/messages`)
        .set('Authorization', authorization)
        .send(forbiddentDto);
      expect(forbiddenResponse.status).toBe(HttpStatus.FORBIDDEN);

      /**
       * Unauthorized流程
       */
      const unauthorizedResponse = await request(app.getHttpServer())
        .post(`/messages`)
        .send(dto);
      expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);
    }
  });
});
