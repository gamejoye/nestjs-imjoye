import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from '../messages.service';
import { DatabaseModule } from '../../database/database.module';
import { WsGatewayModule } from '../../ws-gateway/ws-gateway.module';
import { EnvConfigModule } from '../../env-config/env-config.module';
import { MessagesController } from '../messages.controller';
import { messagesProviders } from '../messages.providers';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { EnvConfigService } from 'src/modules/env-config/env-config.service';
import { User } from 'src/modules/users/entities/user.entity';
import {
  CHATROOM_REPOSITORY,
  MESSAGE_REPOSITORY,
  USER_CHATROOM_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import {
  formatDatetime,
  getChatroomNonExistingId,
  getNonExistingUserChatroom,
  getUserNonExistingId,
  initDatabase,
  sleep,
} from 'src/common/utils';
import { Chatroom } from 'src/modules/chatrooms/entities/chatroom.entity';
import { IAddMessageDto } from '../dto/add-message.dto';
import { UserChatroom } from 'src/modules/chatrooms/entities/user-chatroom.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MessagesService', () => {
  let service: MessagesService;
  let envService: EnvConfigService;
  let usersRepository: Repository<User>;
  let userChatroomRepository: Repository<UserChatroom>;
  let messagesRepository: Repository<Message>;
  let chatroomsRepository: Repository<Chatroom>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, WsGatewayModule, EnvConfigModule],
      controllers: [MessagesController],
      providers: [...messagesProviders, MessagesService],
      exports: [MessagesService],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    envService = module.get<EnvConfigService>(EnvConfigService);
    usersRepository = module.get<Repository<User>>(USER_REPOSITORY);
    userChatroomRepository = module.get<Repository<UserChatroom>>(
      USER_CHATROOM_REPOSITORY,
    );
    messagesRepository = module.get<Repository<Message>>(MESSAGE_REPOSITORY);
    chatroomsRepository = module.get<Repository<Chatroom>>(CHATROOM_REPOSITORY);
  });

  beforeEach(async () => {
    await initDatabase(envService.getDatabaseConfig());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getByPaging work correctly', async () => {
    const chatrooms = await chatroomsRepository.find();
    for (const chatroom of chatrooms) {
      /**
       * 按照createTime从大到小排序
       */
      const messages = (
        await messagesRepository.find({
          where: { chatroom: { id: chatroom.id } },
          relations: ['from', 'chatroom'],
        })
      ).sort((message1, message2) => {
        return (
          new Date(message2.createTime).getTime() -
          new Date(message1.createTime).getTime()
        );
      });
      const messagesToBeTested = await service.getByPaging(chatroom.id);
      expect(messagesToBeTested).toMatchObject(messages);
    }
  });

  it('getLatestMessageByChatroomId work correctly', async () => {
    const chatrooms = await chatroomsRepository.find();
    for (const chatroom of chatrooms) {
      /**
       * 从原本的数据库从获取最后一条消息进行验证
       */
      let latestMessage = (
        await messagesRepository.find({
          where: { chatroom: { id: chatroom.id } },
          relations: ['from', 'chatroom'],
        })
      ).sort((message1, message2) => {
        return (
          new Date(message2.createTime).getTime() -
          new Date(message1.createTime).getTime()
        );
      })[0];
      if (latestMessage === undefined) latestMessage = null;
      let messageToBeTested = await service.getLatestMessageByChatroomId(
        chatroom.id,
      );
      if (latestMessage === null) expect(messageToBeTested).toBeNull();
      else expect(latestMessage).toMatchObject(messageToBeTested);

      /**
       * 新加入的消息是latestMessage
       */
      const { user } = await userChatroomRepository.findOne({
        where: { chatroom: { id: chatroom.id } },
        relations: ['user'],
      });
      const dto: IAddMessageDto = {
        temporaryId: -1,
        chatroom: { id: chatroom.id },
        from: { id: user.id },
        content: 'test message',
      };
      const newMessage = await service.addMessage(dto);
      newMessage.temporaryId = undefined;
      messageToBeTested = await service.getLatestMessageByChatroomId(
        chatroom.id,
      );
      expect(messageToBeTested).not.toBeNull();
      expect(newMessage).toMatchObject(messageToBeTested);
    }
  });

  it('addMessage work correctly', async () => {
    /**
     * 正常逻辑
     */
    const chatrooms = await chatroomsRepository.find();
    const addCount = 10;
    const initialCounts = (
      await Promise.all(
        chatrooms.map<Promise<[number, number]>>(async (chatroom) => {
          const count = await messagesRepository.count({
            where: { chatroom: { id: chatroom.id } },
          });
          return [chatroom.id, count];
        }),
      )
    ).sort(([chatoomId1], [chatroomId2]) => chatoomId1 - chatroomId2);
    for (const chatroom of chatrooms) {
      const { user } = await userChatroomRepository.findOne({
        where: { chatroom: { id: chatroom.id } },
        relations: ['user'],
      });
      for (let currentIndex = 0; currentIndex < addCount; currentIndex++) {
        const dto: IAddMessageDto = {
          temporaryId: -1,
          chatroom: { id: chatroom.id },
          from: { id: user.id },
          content: `test message ${currentIndex} to chatroom[${chatroom.id}] from user[${user.id}]`,
        };
        await service.addMessage(dto);
      }
    }
    const counts = (
      await Promise.all(
        chatrooms.map<Promise<[number, number]>>(async (chatroom) => {
          const count = await messagesRepository.count({
            where: { chatroom: { id: chatroom.id } },
          });
          return [chatroom.id, count];
        }),
      )
    ).sort(([chatoomId1], [chatroomId2]) => chatoomId1 - chatroomId2);
    const countsAfterDesc10 = counts.map(([chatroomId, count]) => [
      chatroomId,
      count - addCount,
    ]);
    expect(countsAfterDesc10).toMatchObject(initialCounts);

    /**
     * 异常逻辑
     */
    const nonExistingChatroomId =
      await getChatroomNonExistingId(chatroomsRepository);
    const nonExistingUserId = await getUserNonExistingId(usersRepository);
    const allUsers = await usersRepository.find({});
    const allChatrooms = await chatroomsRepository.find({});
    // 不存在的chatroomId
    let dto: IAddMessageDto = {
      temporaryId: -1,
      chatroom: { id: nonExistingChatroomId },
      from: { id: allUsers[0].id },
      content: 'test content',
    };
    await service
      .addMessage(dto)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
    // 不存在的userId
    dto = {
      temporaryId: -1,
      chatroom: { id: allChatrooms[0].id },
      from: { id: nonExistingUserId },
      content: 'test content',
    };
    await service
      .addMessage(dto)
      .then(() => {
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      });
    // 不存在的userChatroom
    const nonExisintDtos: Array<IAddMessageDto> = (
      await getNonExistingUserChatroom(
        usersRepository,
        chatroomsRepository,
        userChatroomRepository,
      )
    ).map(({ userId, chatroomId }) => ({
      temporaryId: -1,
      chatroom: { id: chatroomId },
      from: { id: userId },
      content: 'test',
    }));
    expect(nonExisintDtos.length).toBeGreaterThan(0);
    for (let i = 0; i < nonExisintDtos.length; i++) {
      const dto = nonExisintDtos[i];
      await service
        .addMessage(dto)
        .then(() => {
          expect(true).toBe(false);
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(HttpException);
          expect((e as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
        });
    }
  });
  it('countByTime work correctly', async () => {
    /**
     * 生成待测试timestamp数据
     * 从当前时刻开始 每递增一次下标 timestamp往前推一天
     */
    const ms = 24 * 60 * 60 * 1000;
    const timpstampsNumberToBeTested = 1;
    const datetimes: Array<string> = [];
    const currrent = new Date().getTime();
    for (let i = 0; i < timpstampsNumberToBeTested; i++) {
      const timestamp = currrent - ms * i;
      datetimes.push(formatDatetime(timestamp));
    }

    /**
     * 测试所需要使用的user 和 chatroom
     */
    const { user, chatroom } = (
      await userChatroomRepository.find({
        relations: ['chatroom', 'user'],
      })
    )[0];
    /**
     * 记录一开始的基础信息
     */
    const initialCounts = await Promise.all(
      datetimes.map(async (datetime) =>
        service.countByTime(chatroom.id, datetime),
      ),
    );
    // 休眠1秒
    await sleep(1000);
    /**
     * 开始添加数据
     */
    const messageNumberToBeAdd = 10;
    for (let i = 0; i < messageNumberToBeAdd; i++) {
      const dto: IAddMessageDto = {
        temporaryId: -1,
        chatroom: { id: chatroom.id },
        from: { id: user.id },
        content: `test content [${i}]`,
      };
      await service.addMessage(dto);
    }
    // 休眠1秒
    await sleep(1000);
    /**
     * 验证后面添加的message是否都被统计进去
     */
    const counts = (
      await Promise.all(
        datetimes.map(async (datetime) =>
          service.countByTime(chatroom.id, datetime),
        ),
      )
    ).map((count) => count - messageNumberToBeAdd);
    expect(counts).toMatchObject(initialCounts);
  });
});
