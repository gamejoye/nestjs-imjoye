import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { DatabaseModule } from '../database/database.module';
import { messagesProviders } from './messages.providers';
import { MessagesController } from './messages.controller';
import { WsGatewayModule } from '../ws-gateway/ws-gateway.module';
import { ChatroomsService } from '../chatrooms/chatrooms.service';

@Module({
  imports: [DatabaseModule, WsGatewayModule],
  controllers: [MessagesController],
  providers: [...messagesProviders, MessagesService, ChatroomsService],
  exports: [MessagesService],
})
export class MessagesModule {}
