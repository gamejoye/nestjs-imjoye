import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../users/users.module';
import { LocalStrategy } from '../local.strategy';
import { JwtStrategy } from '../jwt.strategy';
import { LoginUserRequestDto } from '../dto/login.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { getCurrentDatetime } from 'src/common/utils';
import * as jwt from 'jsonwebtoken';
import { IUsersService } from 'src/modules/users/interface/users.service.interface';
import { UsersService } from 'src/modules/users/users.service';
import { RegisterUserRequestDto } from '../dto/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { Config } from 'src/config/configuration';

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
  fromFriendRequests: [],
  toFriendRequests: [],
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
          fromFriendRequests: [],
          toFriendRequests: [],
        };
      },
    ),
};

describe('AuthController', () => {
  let controller: AuthController;
  let configService: ConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          load: [configuration],
          isGlobal: true,
        }),
        PassportModule.register({
          defaultStrategy: ['jwt', 'local'],
        }),
        UsersModule,
        ConfigModule,
      ],
      controllers: [AuthController],
      providers: [LocalStrategy, JwtStrategy],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<AuthController>(AuthController);
    configService = module.get<ConfigService>(ConfigService);
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
      configService.get<Config['jwt']>('jwt').secret,
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
