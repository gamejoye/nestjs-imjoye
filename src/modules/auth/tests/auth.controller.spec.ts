import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../users/users.module';
import { LocalStrategy } from '../local.strategy';
import { JwtStrategy } from '../jwt.strategy';
import { EnvConfigModule } from '../../env-config/env-config.module';
import { LoginUserRequestDto } from '../dto/login.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { getCurrentDatetime } from 'src/common/utils';
import * as jwt from 'jsonwebtoken';
import { EnvConfigService } from 'src/modules/env-config/env-config.service';
import { IUsersService } from 'src/modules/users/interface/users.service.interface';
import { UsersService } from 'src/modules/users/users.service';
import { RegisterUserRequestDto } from '../dto/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 测试所需常量
 */
const token = 'token from sign';
const email = 'example@gmail.com';
const nilEmail = 'nil@gmail.com';
const createTime = getCurrentDatetime();
const user: User = {
  id: 1,
  username: 'user',
  email,
  passwordHash: '',
  avatarUrl: '',
  description: '',
  createTime,
  userChatrooms: [],
  fromFriendships: [],
  toFriendships: [],
};

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const mockUsersService: Partial<IUsersService> = {
  getByEmail: jest.fn().mockImplementation(async (email: string) => {
    if (email === nilEmail) return null;
    return user;
  }),
  register: jest
    .fn()
    .mockImplementation(
      async (
        username: string,
        email: string,
        passwordHash: string,
        avatarUrl: string,
      ): Promise<User> => {
        return {
          id: 2,
          username,
          email,
          passwordHash,
          avatarUrl,
          description: '',
          createTime: getCurrentDatetime(),
          userChatrooms: [],
          fromFriendships: [],
          toFriendships: [],
        };
      },
    ),
};

describe('AuthController', () => {
  let controller: AuthController;
  let envConfigService: EnvConfigService;
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
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<AuthController>(AuthController);
    envConfigService = module.get<EnvConfigService>(EnvConfigService);
  });

  it('login逻辑验证', async () => {
    (jwt.sign as jest.Mock).mockReturnValue(token);

    const dto: LoginUserRequestDto = {
      email,
      password: '123456789..',
    };
    await controller.login(user, dto);

    // login验证调用sign进行token签名
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: user.id },
      envConfigService.getJwtConfig().secret,
      expect.any(Object),
    );
  });

  it('register逻辑验证', async () => {
    const dto: RegisterUserRequestDto = {
      username: user.username,
      email: user.email,
      password: '',
      avatarUrl: '',
    };

    await controller
      .register(dto)
      .then(() => {
        // assert test fail
        expect(true).toBe(false);
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.CONFLICT);
      });
    expect(mockUsersService.getByEmail).toHaveBeenLastCalledWith(dto.email);
    expect(mockUsersService.register).not.toHaveBeenCalled();

    const nilDto: RegisterUserRequestDto = {
      username: user.username,
      email: nilEmail,
      password: '',
      avatarUrl: '',
    };
    await controller.register(nilDto);
    expect(mockUsersService.getByEmail).toHaveBeenLastCalledWith(nilDto.email);
    expect(mockUsersService.register).toHaveBeenCalledTimes(1);

    expect(mockUsersService.getByEmail).toHaveBeenCalledTimes(2);
  });
});
