import { Injectable } from '@nestjs/common';
import { IEnvConfigService } from './interface/env-config.service.interface';
import {
  IAvatarConfig,
  IDatabaseConfig,
  IJwtConfig,
} from 'src/common/types/base.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements IEnvConfigService {
  constructor(private configService: ConfigService) {}

  getDatabaseConfig(): IDatabaseConfig {
    return {
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      type: this.configService.get<'mysql'>('DATABASE_TYPE'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_DATABASE'),
    };
  }
  getJwtConfig(): IJwtConfig {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
    };
  }
  getAvatarConfig(): IAvatarConfig {
    return {
      avatarDir: this.configService.get<string>('AVATAR_DIR'),
      avatarUrl: this.configService.get<string>('AVATAR_URL'),
    };
  }
}
