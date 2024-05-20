import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from './env-config.service';
import { ConfigModule } from '@nestjs/config';

describe('EnvConfigService', () => {
  let service: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      providers: [EnvConfigService],
    }).compile();

    service = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('database config property should be defined', () => {
    const config = service.getDatabaseConfig();
    expect(config.username).not.toBeUndefined();
    expect(config.password).not.toBeUndefined();
    expect(config.host).not.toBeUndefined();
    expect(config.database).not.toBeUndefined();
    expect(config.port).not.toBeUndefined();
    expect(config.type).not.toBeUndefined();
  });

  it('jwt condif property should be defined', () => {
    const config = service.getJwtConfig();
    expect(config.secret).not.toBeUndefined();
  });
});
