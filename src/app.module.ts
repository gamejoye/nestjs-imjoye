import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { EnvConfigModule } from './modules/env-config/env-config.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatroomsModule } from './modules/chatrooms/chatrooms.module';
import { MessagesModule } from './modules/messages/messages.module';
import { WsGatewayModule } from './modules/ws-gateway/ws-gateway.module';
import { LoggerMiddleWare } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    EnvConfigModule,
    UsersModule,
    AuthModule,
    ChatroomsModule,
    MessagesModule,
    WsGatewayModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleWare)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
