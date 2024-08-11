import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatroomsModule } from './modules/chatrooms/chatrooms.module';
import { MessagesModule } from './modules/messages/messages.module';
import { WsGatewayModule } from './modules/ws-gateway/ws-gateway.module';
import { LoggerMiddleWare } from './common/middlewares/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { Config } from './config/configuration';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisC = configService.get<Config['redis']>('redis');
        return {
          store: redisStore,
          host: redisC.host,
          port: redisC.port,
          db: redisC.db,
        };
      },
    }),
    UsersModule,
    AuthModule,
    ChatroomsModule,
    MessagesModule,
    WsGatewayModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleWare)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
