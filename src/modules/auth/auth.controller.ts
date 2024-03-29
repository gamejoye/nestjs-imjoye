import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './local.guard';
import { GetUser } from './decorators/get-user.decorator';
import { EnvConfigService } from '../env-config/env-config.service';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import { LoginUserRequestDto } from './dto/login.dto';
import { RegisterUserRequestDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private envConfigService: EnvConfigService) {}

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
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '注册失败' })
  async register(@Body() registerDto: RegisterUserRequestDto) {
    return "";
  }
}
