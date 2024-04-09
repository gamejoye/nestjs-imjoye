import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './local.guard';
import { GetUser } from './decorators/get-user.decorator';
import { EnvConfigService } from '../env-config/env-config.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginUserRequestDto } from './dto/login.dto';
import { RegisterUserRequestDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private envConfigService: EnvConfigService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginUserRequestDto })
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: HttpStatus.OK, description: '登录成功' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '登录失败' })
  async login(@GetUser() user: User) {
    const id = user.id;
    const token = jwt.sign(
      { id },
      this.envConfigService.getJwtConfig().secret,
      { expiresIn: 7 * 24 * 60 },
    );
    const json = {
      id,
      token,
    };
    return json;
  }

  @Post('register')
  @ApiBody({ type: RegisterUserRequestDto })
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: HttpStatus.OK, description: '注册成功' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '用户邮箱已经存在' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '注册失败' })
  async register(@Body() registerDto: RegisterUserRequestDto) {
    const { email, password, username, avatarUrl } = registerDto;
    const existing = await this.usersService.getByEmail(email);
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
    return user;
  }
}
