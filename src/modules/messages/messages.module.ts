import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { DatabaseModule } from '../database/database.module';
import { messagesProviders } from './messages.providers';
import { MessagesController } from './messages.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [MessagesController],
  providers: [...messagesProviders, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
