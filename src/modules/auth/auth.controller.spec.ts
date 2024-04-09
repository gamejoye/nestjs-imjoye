import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { EnvConfigModule } from '../env-config/env-config.module';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({
          defaultStrategy: ['jwt', 'local'],
        }),
        UsersModule,
        EnvConfigModule,
      ],
      controllers: [AuthController],
      providers: [LocalStrategy, JwtStrategy],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
