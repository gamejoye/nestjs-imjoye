import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { EnvConfigModule } from '../env-config/env-config.module';

describe('UserService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, EnvConfigModule],
      controllers: [UsersController],
      providers: [...usersProviders, UsersService],
      exports: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
