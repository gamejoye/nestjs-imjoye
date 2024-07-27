import { DataSource } from 'typeorm';
import { config as loadEnvConfig } from 'dotenv';

// 动态加载环境变量
const env = process.env.NODE_ENV || 'development';
loadEnvConfig({ path: `.env.${env}` });
const dataSource = new DataSource({
  type: process.env.DATABASE_TYPE as 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3006'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../migrations/*.ts'],
  migrationsRun: false, // 禁用自动运行迁移
  synchronize: false, // 禁用自动同步
  extra: {
    dateStrings: true,
  },
});
export default dataSource;
