import { Module } from '@nestjs/common';
import { ChatroomsController } from './chatrooms.controller';
import { ChatroomsService } from './chatrooms.service';
import { DatabaseModule } from '../database/database.module';
import { chatroomsProviders } from './chatrooms.providers';
import { UserChatroomService } from './user-chatroom.service';
import { MessagesService } from '../messages/messages.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ChatroomsController],
  providers: [
    ...chatroomsProviders,
    ChatroomsService,
    UserChatroomService,
    MessagesService,
  ],
  exports: [ChatroomsService],
})
export class ChatroomsModule {}
