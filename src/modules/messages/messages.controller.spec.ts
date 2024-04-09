import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { DatabaseModule } from '../database/database.module';
import { WsGatewayModule } from '../ws-gateway/ws-gateway.module';
import { messagesProviders } from './messages.providers';
import { MessagesService } from './messages.service';
import { EnvConfigModule } from '../env-config/env-config.module';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, WsGatewayModule, EnvConfigModule],
      controllers: [MessagesController],
      providers: [...messagesProviders, MessagesService],
      exports: [MessagesService],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
