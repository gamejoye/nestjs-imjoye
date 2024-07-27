import { DataSource } from 'typeorm';
import { DATA_SOURCE } from 'src/common/constants/providers';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';
import { Logger } from 'src/common/utils';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async (configService: ConfigService) => {
      const config = configService.get<Config['database']>('database');
      Logger.log(config);
      const dataSource = new DataSource({
        type: config.type,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../../migrations/**/*.ts'],
        migrationsRun: false, //禁止自动执行迁移
        synchronize: false, // 禁用自动同步
        extra: {
          dateStrings: true,
        },
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
