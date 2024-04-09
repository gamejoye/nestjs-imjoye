import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';
import { EnvConfigModule } from '../env-config/env-config.module';

describe('UserController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, EnvConfigModule],
      controllers: [UsersController],
      providers: [...usersProviders, UsersService],
      exports: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
