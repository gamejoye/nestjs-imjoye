import { Module } from '@nestjs/common';
import { EnvConfigModule } from './modules/env-config/env-config.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatroomsModule } from './modules/chatrooms/chatrooms.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    EnvConfigModule,
    UsersModule,
    AuthModule,
    ChatroomsModule,
    MessagesModule,
  ],
})
export class AppModule {}
