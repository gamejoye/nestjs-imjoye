import { Module } from '@nestjs/common';
import { ChatroomsController } from './chatrooms.controller';
import { ChatroomsService } from './chatrooms.service';
import { DatabaseModule } from '../database/database.module';
import { chatroomsProviders } from './chatrooms.providers';
import { MessagesModule } from '../messages/messages.module';
import { UserChatroomService } from './user-chatroom.service';

@Module({
  imports: [DatabaseModule, MessagesModule],
  controllers: [ChatroomsController],
  providers: [...chatroomsProviders, ChatroomsService, UserChatroomService],
})
export class ChatroomsModule {}
