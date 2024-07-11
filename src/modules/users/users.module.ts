import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { EnvConfigService } from '../env-config/env-config.service';
import { WsGatewayModule } from '../ws-gateway/ws-gateway.module';
import { ChatroomsModule } from '../chatrooms/chatrooms.module';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      useFactory: async (envConfigService: EnvConfigService) => ({
        storage: multer.diskStorage({
          destination: envConfigService.getAvatarConfig().avatarDir,
          filename: (req, file, callback) => {
            const spilitedOriginalname = file.originalname.split('.');
            const fileExtName =
              spilitedOriginalname[spilitedOriginalname.length - 1];
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            callback(null, `${randomName}.${fileExtName}`);
          },
        }),
        limits: {
          fileSize: 1024 * 1024 * 2, // 2MB
        },
      }),
      inject: [EnvConfigService],
    }),
    WsGatewayModule,
    ChatroomsModule,
  ],
  controllers: [UsersController],
  providers: [...usersProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
