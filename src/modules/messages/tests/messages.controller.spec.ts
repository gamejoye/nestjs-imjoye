import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from '../messages.controller';
import { DatabaseModule } from '../../database/database.module';
import { WsGatewayModule } from '../../ws-gateway/ws-gateway.module';
import { messagesProviders } from '../messages.providers';
import { MessagesService } from '../messages.service';
import { IMessagesService } from '../interface/messages.service.interface';
import { WsGatewayService } from 'src/modules/ws-gateway/ws-gateway.service';
import { User } from 'src/modules/users/entities/user.entity';
import { getCurrentDatetime } from 'src/common/utils';
import { Chatroom } from 'src/modules/chatrooms/entities/chatroom.entity';
import { ChatroomType } from 'src/common/constants/chatroom';
import { Message } from '../entities/message.entity';
import { IAddMessageDto } from '../dto/add-message.dto';
import { ChatroomsService } from 'src/modules/chatrooms/chatrooms.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { BasePaging } from 'src/common/types/base.dto';
import { GetMessagesDto } from '../dto/get-messages-by-chatroom-id.dto';
import { PagingMessagesVo } from '../vo/pagine-messages.vo';
import { MessageVo } from '../vo/message.vo';
import { transformMessage } from '../vo/utils';

/**
 * 测试所需常量
 */
const user: User = {
  id: 1,
  username: 'user',
  email: 'user@gmail.com',
  passwordHash: '',
  avatarUrl: '',
  description: '',
  createTime: getCurrentDatetime(),
  userChatrooms: [],
  fromFriendships: [],
  toFriendships: [],
  fromFriendRequests: [],
  toFriendRequests: [],
};
const friend1: User = {
  id: 2,
  username: 'friend1',
  email: 'friend1@gmail.com',
  passwordHash: '',
  avatarUrl: '',
  description: '',
  createTime: getCurrentDatetime(),
  userChatrooms: [],
  fromFriendships: [],
  toFriendships: [],
  fromFriendRequests: [],
  toFriendRequests: [],
};

const chatroom: Chatroom = {
  id: 2,
  type: ChatroomType.MULTIPLE,
  name: '爱之诗',
  avatarUrl: '',
  createTime: getCurrentDatetime(),
  userChatrooms: [],
  messages: [],
};

const messages: Array<Message> = [
  {
    id: 1,
    chatroom,
    from: user,
    content: `test content from ${user.username}`,
    createTime: getCurrentDatetime(),
  },
  {
    id: 2,
    chatroom,
    from: friend1,
    content: `test content from ${friend1.username}`,
    createTime: getCurrentDatetime(),
  },
];

const mockMessagesService: Partial<IMessagesService> = {
  getByPaging: jest.fn(),
  getByOldestPaging: jest.fn(),
  addMessage: jest.fn(),
  countAll: jest.fn(),
};

const mockWsGatewayService: Partial<WsGatewayService> = {
  notifynChat: jest.fn(),
};

const mockChatroomsService: Partial<ChatroomsService> = {
  getByChatroomId: jest.fn(),
};

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        WsGatewayModule,
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          load: [configuration],
          isGlobal: true,
        }),
      ],
      controllers: [MessagesController],
      providers: [...messagesProviders, MessagesService, ChatroomsService],
      exports: [MessagesService],
    })
      .overrideProvider(MessagesService)
      .useValue(mockMessagesService)
      .overrideProvider(WsGatewayService)
      .useValue(mockWsGatewayService)
      .overrideProvider(ChatroomsService)
      .useValue(mockChatroomsService)
      .compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getMessagesByChatroomId逻辑验证', async () => {
    const paging: GetMessagesDto = {
      room_id: chatroom.id,
      page_size: 10,
    };
    (mockMessagesService.getByOldestPaging as jest.Mock).mockImplementation(
      function (chatroomId: number, paging: GetMessagesDto): Array<MessageVo> {
        if (chatroom.id !== chatroomId) {
          return [];
        }
        const messageVos: Array<MessageVo> = [];
        for (
          let i = messages.length - 1;
          i >= 0 && messageVos.length < paging.page_size + 1;
          i--
        ) {
          if (
            paging.oldest_message_id === undefined ||
            messages[i].id < paging.oldest_message_id
          ) {
            messageVos.push(transformMessage(messages[i]));
          }
        }
        return messageVos;
      },
    );
    (mockChatroomsService.getByChatroomId as jest.Mock).mockResolvedValue(
      chatroom,
    );
    (mockMessagesService.countAll as jest.Mock).mockResolvedValue(
      messages.length,
    );
    await controller.getMessagesByChatroomId(user, paging);
    expect(mockMessagesService.getByOldestPaging).toHaveBeenCalledTimes(1);
    expect(mockMessagesService.getByOldestPaging).toHaveBeenCalledWith(
      chatroom.id,
      {
        oldest_message_id: paging.oldest_message_id,
        page_size: paging.page_size + 1,
      },
    );
  });

  it('addMessage逻辑验证', async () => {
    const meesageToBeAdd = messages[0];
    (mockMessagesService.addMessage as jest.Mock).mockResolvedValue(
      meesageToBeAdd,
    );
    const dto: IAddMessageDto = {
      temporaryId: -1,
      chatroom,
      from: meesageToBeAdd.from,
      content: meesageToBeAdd.content,
    };
    await controller.addMessage(dto);
    expect(mockMessagesService.addMessage).toHaveBeenCalledTimes(1);
    expect(mockMessagesService.addMessage).toHaveBeenCalledWith(dto);
    expect(mockWsGatewayService.notifynChat).toHaveBeenCalledTimes(1);
    expect(mockWsGatewayService.notifynChat).toHaveBeenCalledWith(
      meesageToBeAdd.from.id,
      meesageToBeAdd,
    );
  });
});
