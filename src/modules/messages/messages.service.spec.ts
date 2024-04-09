import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { DatabaseModule } from '../database/database.module';
import { WsGatewayModule } from '../ws-gateway/ws-gateway.module';
import { EnvConfigModule } from '../env-config/env-config.module';
import { MessagesController } from './messages.controller';
import { messagesProviders } from './messages.providers';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, WsGatewayModule, EnvConfigModule],
      controllers: [MessagesController],
      providers: [...messagesProviders, MessagesService],
      exports: [MessagesService],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
