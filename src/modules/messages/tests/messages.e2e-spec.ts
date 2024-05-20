import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Chatroom } from 'src/modules/chatrooms/entities/chatroom.entity';
import { UserChatroom } from 'src/modules/chatrooms/entities/user-chatroom.entity';
import { EnvConfigService } from 'src/modules/env-config/env-config.service';
import { User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { MessagesModule } from '../messages.module';
import { DatabaseModule } from 'src/modules/database/database.module';
import { WsGatewayModule } from 'src/modules/ws-gateway/ws-gateway.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/modules/users/users.module';
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
  Logger,
  getChatroomNonExistingId,
  getNonExistingUserChatroom,
  getUserNonExistingId,
  initDatabase,
  usersLoginDto,
} from 'src/common/utils';
import { EnvConfigModule } from 'src/modules/env-config/env-config.module';
import { Message } from '../entities/message.entity';
import { GetMessagesByChatroomIdDto } from '../dto/get-messages-by-chatroom-id.dto';
import { MessageVo } from '../vo/message.vo';
import { IAddMessageDto } from '../dto/add-message.dto';
import { transformMessage } from '../vo/utils';

describe('ChatroomController (e2e)', () => {
  let app: INestApplication;
  let envConfigService: EnvConfigService;
  let messagesRepository: Repository<Message>;
  let usersRepository: Repository<User>;
  let chatroomsRepository: Repository<Chatroom>;
  let userChatroomRepository: Repository<UserChatroom>;

  let authorization: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MessagesModule, DatabaseModule, EnvConfigModule, AuthModule],
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

  it('GET /messages with some parameters', async () => {
    /**
     * 正常流程
     */
    const chatrooms = await chatroomsRepository.find();
    for (const chatroom of chatrooms) {
      const query: GetMessagesByChatroomIdDto = {
        room_id: chatroom.id,
      };
      const response = await request(app.getHttpServer())
        .get(`/messages`)
        .query(query)
        .set('Authorization', authorization);
      expect(response.status).toBe(HttpStatus.OK);
      const messageVos: Array<MessageVo> = response.body.data;
      const messages = (
        await messagesRepository.find({
          where: { chatroom: { id: chatroom.id } },
          relations: ['from', 'chatroom'],
        })
      ).sort(
        (message1, message2) =>
          new Date(message2.createTime).getTime() -
          new Date(message1.createTime).getTime(),
      );
      expect(
        messages.map((message) => transformMessage(message)),
      ).toMatchObject(messageVos);
    }

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
      .query(notFoundQuery)
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
      // 根据userId获取email用户登录
      const { email } = await usersRepository.findOne({
        where: { id: userId },
      });
      // loginDto 提供email和password
      const loginDto: LoginUserRequestDto = { password: '123456..', email };
      // 登录获取该userId的token
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);
      const { token } = loginRes.body.data;

      const dto: GetMessagesByChatroomIdDto = { room_id: chatroomId };
      const authorization = 'Bearer ' + token;
      const notFoundResponse = await request(app.getHttpServer())
        .get(`/messages`)
        .query(dto)
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
        .query(badQuery)
        .set('Authorization', authorization);
      expect(badRequestResponse.status).toBe(HttpStatus.BAD_REQUEST);
    }

    /**
     * 未认证流程
     */
    const query: GetMessagesByChatroomIdDto = { room_id: 1 };
    const unauthorizedResponse = await request(app.getHttpServer())
      .get(`/messages`)
      .query(query);
    expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('POST /messages', async () => {
    /**
     * 正常流程
     */
    const { user, chatroom } = await userChatroomRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'chatroom'],
    });
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
    Logger.test(nonExistingUserChatrooms);
    for (const nonExistingUserChatroom of nonExistingUserChatrooms) {
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
    }

    /**
     * Unauthorized流程
     */
    const unauthorizedResponse = await request(app.getHttpServer())
      .post(`/messages`)
      .send(dto);
    expect(unauthorizedResponse.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
