import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomsService } from './chatrooms.service';
import { DatabaseModule } from '../database/database.module';
import { MessagesModule } from '../messages/messages.module';
import { EnvConfigModule } from '../env-config/env-config.module';
import { ChatroomsController } from './chatrooms.controller';
import { chatroomsProviders } from './chatrooms.providers';

describe('ChatroomsService', () => {
  let service: ChatroomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, MessagesModule, EnvConfigModule],
      controllers: [ChatroomsController],
      providers: [...chatroomsProviders, ChatroomsService],
    }).compile();

    service = module.get<ChatroomsService>(ChatroomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
