import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { EnvConfigService } from '../env-config/env-config.service';
import { Response } from 'express';
import { UserVo } from './vo/user.vo';
import { transformFriendInfo, transformUser } from './vo/utils/user-transform';
import { FriendInfoVo } from './vo/friend-info.vo';
import {
  ApiCreatedResponseResult,
  ApiOkResponseResult,
} from 'src/common/types/response.type';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly envConfigService: EnvConfigService,
  ) {}

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '根据userId获取用户' })
  @ApiOkResponseResult({
    model: UserVo,
    description: '成功获取用户',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserVo> {
    const target = await this.usersService.getById(id);
    return transformUser(target);
  }

  @Get(':id/friends')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '根据userId获取好友列表' })
  @ApiOkResponseResult({
    model: UserVo,
    description: '成功根据userId获取好友列表',
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '权限不足',
  })
  async getFriendsById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Array<UserVo>> {
    if (user.id !== id) {
      throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
    }
    const friends = await this.usersService.getFriends(id);
    return friends.map((friend) => transformUser(friend));
  }

  @Get(':id/friends/:friendId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '获取好友信息' })
  @ApiOkResponseResult({
    model: FriendInfoVo,
    description: '成功获取好友信息',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '权限不足',
  })
  async getFriendInfoByUserIdAndFriendId(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<FriendInfoVo> {
    if (user.id !== id) {
      throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
    }
    const friendInfo = await this.usersService.getFriendInfoByUserIdAndFriendId(
      id,
      friendId,
    );
    return transformFriendInfo(friendInfo);
  }

  @Post('avatar/upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传头像' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponseResult({
    model: 'string',
    description: '头像上传成功',
  })
  @ApiResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: '头像大小超过2MB',
  })
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Res({ passthrough: true }) res: Response,
  ) {
    const filename = file.filename;
    const avatarUrl = this.envConfigService.getAvatarConfig().avatarUrl;
    const userAvatarUrl = avatarUrl + '/' + filename;
    return userAvatarUrl;
  }
}
