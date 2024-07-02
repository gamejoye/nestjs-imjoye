import { Test, TestingModule } from '@nestjs/testing';
import { WsGatewayService } from '../ws-gateway.service';
import { wsGatewayProviders } from '../ws-gateway.providers';
import { DatabaseModule } from '../../database/database.module';
import { EnvConfigModule } from '../../env-config/env-config.module';
import { EnvConfigService } from '../../env-config/env-config.service';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Chatroom } from '../../chatrooms/entities/chatroom.entity';
import {
  CHATROOM_REPOSITORY,
  FRIEND_REQUEST_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { ChatroomType } from 'src/common/constants/chatroom';
import {
  getCurrentDatetime,
  getNonExsitingFriendRequest,
  initDatabase,
  mockJwt,
} from 'src/common/utils';
import { WebSocket } from 'ws';
import { AUTHORIZATION } from 'src/common/constants/websocketHeaders';
import { IWebSocketMessage } from 'src/common/types/base.type';
import { Message } from '../../messages/entities/message.entity';
import { WebSocketEventType } from 'src/common/constants/websocketEvents';
import { Logger } from 'src/common/utils';
import { FriendRequest } from 'src/modules/users/entities/friendrequest.entity';
import { FriendRequestType } from 'src/common/constants/friendrequest';

describe('WsGatewayService', () => {
  let wsGatewayService: WsGatewayService;
  let usersRepository: Repository<User>;
  let chatroomsRepository: Repository<Chatroom>;
  let friendRequestsRepository: Repository<FriendRequest>;
  let envConfigService: EnvConfigService;
  let connectToServer: (users: User[]) => Promise<WebSocket[]>;

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
    friendRequestsRepository = module.get<Repository<FriendRequest>>(
      FRIEND_REQUEST_REPOSITORY,
    );

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

  connectToServer = async (users: User[]) => {
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
            if (count === userClients.length) {
              Logger.test('done!!!');
              resolve();
            }
          });
          client.on('close', () => {
            count--;
          });
        });
      });
    } catch (e) {
      expect(true).toBe(false);
    }

    return userClients;
  };

  it('notifyNewFriend work correctly', async () => {
    const sorter = (o1: [number, User], o2: [number, User]) => {
      if (o1[0] === o2[0]) return o1[1].id - o2[1].id;
      return o1[0] - o2[0];
    };
    const users = await usersRepository.find();
    const clients = await connectToServer(users);
    const all: Array<[number, User]> = [];
    const expected: Array<[number, User]> = [];
    clients.forEach((client, index) => {
      client.on('message', (rawData) => {
        const message: IWebSocketMessage<User> = JSON.parse(
          rawData.toString('utf-8'),
        );
        all.push([users[index].id, message.payload]);
      });
    });
    const N = users.length;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        wsGatewayService.notifyNewFriend(users[i].id, users[j]);
        expected.push([users[i].id, users[j]]);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    all.sort(sorter);
    expected.sort(sorter);
    expect(all).toMatchObject(expected);
  });

  it('notifyNewFriendRequest work correctly', async () => {
    const users = await usersRepository.find();
    const clients = await connectToServer(users);
    const expected: Array<[User, FriendRequest]> = [];
    clients.forEach((client, index) => {
      client.on('message', (rawData) => {
        const message: IWebSocketMessage<FriendRequest> = JSON.parse(
          rawData.toString('utf-8'),
        );
        expected.push([users[index], message.payload]);
      });
    });

    const ids = getNonExsitingFriendRequest(
      usersRepository,
      friendRequestsRepository,
    );
    const from = await usersRepository.findOne({ where: { id: ids[0] } });
    const to = await usersRepository.findOne({ where: { id: ids[1] } });
    const pendingFq: FriendRequest = {
      id: 1,
      from,
      to,
      status: FriendRequestType.PENDING,
      createTime: getCurrentDatetime(),
      updateTime: null,
    };
    await wsGatewayService.notifyNewFriendRequest(to.id, pendingFq);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(expected).toMatchObject([[to, pendingFq]]);
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

      const userClients = await connectToServer(users);

      // 4. users[0..x]确认接收消息
      const message: Message = {
        id: 1,
        chatroom: multipleChatroom,
        from: users[0],
        content: `test content from user ${users[0].username}`,
        createTime: getCurrentDatetime(),
      };
      await wsGatewayService.notifynChat(users[0].id, message);
      const websocketMessages: Array<IWebSocketMessage<Message>> =
        await new Promise<Array<IWebSocketMessage<Message>>>((resolve) => {
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

      // 5. 保证userClient收到的是 NEW_MESSAGE
      expect(websocketMessages.length).toBe(userClients.length);
      for (let i = 0; i < websocketMessages.length; i++) {
        const wsMessage = websocketMessages[i];
        // receiver
        expect(wsMessage.event).toBe(WebSocketEventType.NEW_MESSAGE);
        expect(wsMessage.payload).toBeDefined();
        expect(wsMessage.payload).toEqual(message);
      }
    }
  });
});
