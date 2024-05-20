import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../auth.module';
import { UsersModule } from '../../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { EnvConfigModule } from '../../env-config/env-config.module';
import { Logger, initDatabase } from 'src/common/utils';
import { EnvConfigService } from '../../env-config/env-config.service';
import { RegisterUserRequestDto } from '../dto/register.dto';
import { UserVo } from '../../users/vo/user.vo';
import { LoginUserRequestDto } from '../dto/login.dto';
import { LoginVo } from '../vo/login.vo';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ResTransformInterceptor } from 'src/common/interceptors/res-transform.interceptors';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let envConfigService: EnvConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        PassportModule.register({
          defaultStrategy: ['jwt', 'local'],
        }),
        UsersModule,
        EnvConfigModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        validateCustomDecorators: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResTransformInterceptor());
    await app.init();
    envConfigService = moduleFixture.get<EnvConfigService>(EnvConfigService);
  });

  beforeEach(async () => {
    await initDatabase(envConfigService.getDatabaseConfig());
  });

  afterAll(async () => {
    await app.close();
  });

  it('/register', async () => {
    const username = 'nil';
    const email = 'nilnilnil@gmail.com';
    const password = '123456test';
    const avatarUrl = 'https://test.com/avatar.jpg';

    const dto: RegisterUserRequestDto = {
      username,
      email,
      password,
      avatarUrl,
    };

    const partialUserVo: Partial<UserVo> = {
      username,
      email,
      avatarUrl,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto);
    Logger.test(response.body);
    const userVo = response.body.data;
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(userVo).toMatchObject(partialUserVo);
    expect(typeof userVo.id).toBe('number');

    // 第二次register
    const secondResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto);
    expect(secondResponse.status).toBe(HttpStatus.CONFLICT);

    /**
     * BadRequest流程
     */
    const badRequestDto: RegisterUserRequestDto = {
      username,
      email: 'not email',
      password,
      avatarUrl,
    };
    const badRequestResgiterRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send(badRequestDto);
    expect(badRequestResgiterRes.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('/login', async () => {
    const username = 'nil';
    const email = 'nilnilnil@gmail.com';
    const password = '123456test';
    const avatarUrl = 'https://test.com/avatar.jpg';

    const registerDto: RegisterUserRequestDto = {
      username,
      email,
      password,
      avatarUrl,
    };

    const correctLoginDto: LoginUserRequestDto = {
      email,
      password,
    };

    const wrongLoginDto: LoginUserRequestDto = {
      email,
      password: 'wrong password',
    };

    // 先注册一个账号
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);
    expect(registerRes.status).toBe(HttpStatus.CREATED);
    const userVo: UserVo = registerRes.body.data;
    expect(typeof userVo.id).toBe('number');

    // 正确登录
    const correctLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(correctLoginDto);
    expect(correctLoginRes.status).toBe(HttpStatus.OK);
    const loginVo: LoginVo = correctLoginRes.body.data;
    expect(loginVo.id).toBe(userVo.id);
    expect(typeof loginVo.token).toBe('string');
    expect(loginVo.token.length).toBeGreaterThan(0);

    // 错误登录
    const wrongLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(wrongLoginDto);
    expect(wrongLoginRes.status).toBe(HttpStatus.UNAUTHORIZED);

    // 参数不正确
    const badRequestLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({});
    expect(badRequestLoginRes.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});
