import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalGuard } from './local.guard';
import { GetUser } from './decorators/get-user.decorator';
import { EnvConfigService } from '../env-config/env-config.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginUserRequestDto } from './dto/login.dto';
import { RegisterUserRequestDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginVo } from './vo/login.vo';
import { UserVo } from '../users/vo/user.vo';
import {
  ApiBaseResult,
  ApiCreatedResponseResult,
} from 'src/common/types/response.type';
import { Logger } from 'src/common/utils';

@ApiExtraModels(ApiBaseResult)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private envConfigService: EnvConfigService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginUserRequestDto })
  @ApiOperation({ summary: '用户登录' })
  @ApiCreatedResponseResult({ model: LoginVo, description: '登录成功' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '登录失败',
  })
  async login(
    @GetUser() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() dto: LoginUserRequestDto,
  ): Promise<LoginVo> {
    const id = user.id;
    const token = jwt.sign(
      { id },
      this.envConfigService.getJwtConfig().secret,
      { expiresIn: '7d' },
    );
    return {
      id,
      token,
    };
  }

  @Post('register')
  @ApiBody({ type: RegisterUserRequestDto })
  @ApiOperation({ summary: '用户注册' })
  @ApiCreatedResponseResult({ model: UserVo, description: '注册成功' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '用户邮箱已经存在' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '注册失败' })
  async register(@Body() registerDto: RegisterUserRequestDto): Promise<UserVo> {
    const { email, password, username, avatarUrl } = registerDto;
    Logger.log(registerDto);
    const existing = await this.usersService.getByEmail(email);
    console.log('ex: ', existing);
    if (existing) {
      throw new HttpException('email already exists', HttpStatus.CONFLICT);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.register(
      username,
      email,
      passwordHash,
      avatarUrl,
    );
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      description: user.description,
      createTime: user.createTime,
    };
  }
}
