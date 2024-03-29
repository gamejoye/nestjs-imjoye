import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { DatabaseModule } from '../database/database.module';
import { messagesProviders } from './messages.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...messagesProviders, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
