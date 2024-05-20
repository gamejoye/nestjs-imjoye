import { Test, TestingModule } from '@nestjs/testing';
import { WsGatewayService } from './ws-gateway.service';
import { wsGatewayProviders } from './ws-gateway.providers';
import { DatabaseModule } from '../database/database.module';
import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvConfigService } from '../env-config/env-config.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Chatroom } from '../chatrooms/entities/chatroom.entity';
import {
  CHATROOM_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { ChatroomType } from 'src/common/constants/chatroom';
import { getCurrentDatetime, initDatabase, mockJwt } from 'src/common/utils';
import { WebSocket } from 'ws';
import { AUTHORIZATION } from 'src/common/constants/websocketHeaders';
import { IWebSocketMessage } from 'src/common/types/base.type';
import { Message } from '../messages/entities/message.entity';
import { WebSocketEvent } from 'src/common/constants/websocketEvents';
import { Logger } from 'src/common/utils';

describe('WsGatewayService', () => {
  let wsGatewayService: WsGatewayService;
  let usersRepository: Repository<User>;
  let chatroomsRepository: Repository<Chatroom>;
  let envConfigService: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, EnvConfigModule],
      providers: [...wsGatewayProviders, WsGatewayService],
      exports: [WsGatewayService],
    }).compile();

    wsGatewayService = module.get<WsGatewayService>(WsGatewayService);
    envConfigService = module.get<EnvConfigService>(EnvConfigService);
    usersRepository = module.get<Repository<User>>(USER_REPOSITORY);
    chatroomsRepository = module.get<Repository<Chatroom>>(CHATROOM_REPOSITORY);

    wsGatewayService.onModuleInit();
    await initDatabase(envConfigService.getDatabaseConfig());
  });

  afterEach(async () => {
    wsGatewayService.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(wsGatewayService).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(chatroomsRepository).toBeDefined();
    expect(envConfigService).toBeDefined();
  });

  it('notifyChat should work correctly', async () => {
    const chatrooms = await chatroomsRepository.find();
    for (let i = 0; i < chatrooms.length; i++) {
      const chatroom = chatrooms[i];
      const users = await usersRepository
        .createQueryBuilder('user')
        .innerJoin('user.userChatrooms', 'userChatroom')
        .innerJoin('userChatroom.chatroom', 'chatroom')
        .where('chatroom.id = :chatroomId', { chatroomId: chatroom.id })
        .getMany();
      expect(users.length).toBeGreaterThan(0);
    }

    const multipleChatrooms = chatrooms.filter(
      (chatroom) => chatroom.type === ChatroomType.MULTIPLE,
    );
    for (let i = 0; i < multipleChatrooms.length; i++) {
      const multipleChatroom = multipleChatrooms[i];
      expect(multipleChatroom.type).toBe(ChatroomType.MULTIPLE);
      const users = await usersRepository
        .createQueryBuilder('user')
        .innerJoin('user.userChatrooms', 'userChatroom')
        .innerJoin('userChatroom.chatroom', 'chatroom')
        .where('chatroom.id = :chatroomId', { chatroomId: multipleChatroom.id })
        .getMany();
      // 1. Mock jwt
      // 2. user 连接 webSocketServer
      const userClients = users.map((user) => {
        const jwtConfig = envConfigService.getJwtConfig();
        const authorization = mockJwt(user.id, jwtConfig.secret);

        return new WebSocket('ws://localhost:5173', {
          headers: {
            [AUTHORIZATION]: authorization,
          },
        });
      });

      const TIMEOUT = 1000;

      // 3. 等待用户全部正确连接
      try {
        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            reject();
          }, TIMEOUT);

          let count = 0;
          userClients.forEach((client) => {
            client.on('open', () => {
              count++;
              Logger.test('open', count, ' total', userClients.length);
              if (count === userClients.length) {
                Logger.test('done!!!');
                resolve();
              }
            });
            client.off('close', () => {
              count--;
            });
          });
        });
      } catch (e) {
        expect(true).toBe(false);
      }

      // 4. users[0] 发送消息 users[1..x]确认接收消息
      const message: Message = {
        id: 1,
        chatroom: multipleChatroom,
        from: users[0],
        content: `test content from user ${users[0].username}`,
        createTime: getCurrentDatetime(),
      };
      wsGatewayService.notifynChat(users[0].id, message);
      let websocketMessages: Array<IWebSocketMessage<Message>>;
      try {
        websocketMessages = await new Promise<
          Array<IWebSocketMessage<Message>>
        >((resolve, reject) => {
          setTimeout(() => {
            reject();
          }, TIMEOUT);
          const messages: Array<IWebSocketMessage<Message>> = [];
          let count = 0;
          userClients.forEach((client, index) => {
            client.on('message', (rawData) => {
              const message: IWebSocketMessage<Message> = JSON.parse(
                rawData.toString('utf-8'),
              );
              messages[index] = message;
              count++;
              if (count === userClients.length) {
                resolve(messages);
              }
            });
          });
        });
      } catch (e) {
        expect(true).toBe(false);
      }

      // 5. 保证userClient[0]收到的是MESSAGE_ACK 其他的收到的是NOTIFY_SYN
      expect(websocketMessages.length).toBe(userClients.length);
      for (let i = 0; i < websocketMessages.length; i++) {
        const wsMessage = websocketMessages[i];
        if (i === 0) {
          // sender
          expect(wsMessage.event).toBe(WebSocketEvent.MESSAGE_ACK);
        } else {
          // receiver
          expect(wsMessage.event).toBe(WebSocketEvent.MESSAGE_NOTIFY_SYN);
        }
        expect(wsMessage.payload).toBeDefined();
        expect(wsMessage.payload).toEqual(message);
      }
    }
  });
});
