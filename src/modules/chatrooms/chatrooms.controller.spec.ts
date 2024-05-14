import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomsController } from './chatrooms.controller';
import { DatabaseModule } from '../database/database.module';
import { MessagesModule } from '../messages/messages.module';
import { chatroomsProviders } from './chatrooms.providers';
import { ChatroomsService } from './chatrooms.service';
import { EnvConfigModule } from '../env-config/env-config.module';
import { UserChatroomService } from './user-chatroom.service';

describe('ChatroomsController', () => {
  let controller: ChatroomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, MessagesModule, EnvConfigModule],
      controllers: [ChatroomsController],
      providers: [...chatroomsProviders, ChatroomsService, UserChatroomService],
    }).compile();

    controller = module.get<ChatroomsController>(ChatroomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
