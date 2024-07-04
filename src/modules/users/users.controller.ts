import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import {
  transformFriendInfo,
  transformFriendRequest,
  transformUser,
} from './vo/utils/user-transform';
import { FriendInfoVo } from './vo/friend-info.vo';
import {
  ApiCreatedResponseResult,
  ApiOkResponseResult,
} from 'src/common/types/response.type';
import { FriendRequestVo } from './vo/friendrequest.vo';
import { PostFriendRequestDto } from './dto/post-friend-request.dto';
import { FriendRequestType } from 'src/common/constants/friendrequest';
import { WsGatewayService } from '../ws-gateway/ws-gateway.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly wsService: WsGatewayService,
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

  @Get(':id/friends/requests')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '根据userId获取好友请求列表' })
  @ApiOkResponseResult({
    model: FriendRequestVo,
    description: '成功获取好友请求列表',
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
  async getFriendRequestsById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (user.id !== id) {
      throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
    }
    const fqs = await this.usersService.getFriendRqeusts(user.id);
    return fqs;
  }

  @Post(':id/friends/requests')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary:
      '发送一个好友请求，如果互相发送则后面发送的请求等价于直接同意之前的请求',
  })
  @ApiCreatedResponseResult({
    model: FriendRequestVo,
    description: '成功发送好友请求或者默认同意之前的好友请求',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '权限不足',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '重复发送好友请求',
  })
  async postFriendRequest(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PostFriendRequestDto,
  ) {
    if (user.id !== id || dto.from !== id) {
      throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
    }
    const fq = await this.usersService.createFriendRequest(dto.from, dto.to);
    if (!fq) {
      throw new HttpException('重复发送好友请求', HttpStatus.CONFLICT);
    }
    if (fq.status === FriendRequestType.PENDING) {
      // 通知接收者有新的好友请求
      await this.wsService.notifyNewFriendRequest(fq.to.id, fq);
    } else if (fq.status === FriendRequestType.ACCEPT) {
      // 通知发送者和发送者有新的好友
      await Promise.all([
        this.wsService.notifyNewFriend(fq.from.id, fq.to),
        this.wsService.notifyNewFriend(fq.to.id, fq.from),
      ]);
    }
    return transformFriendRequest(fq);
  }

  @Put(':id/friends/requests/:requestId/accept')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '同意好友请求' })
  @ApiOkResponseResult({
    model: FriendRequestVo,
    description: '成功通过好友请求',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '权限不足',
  })
  async acceptFriendRequest(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Param('requestId', ParseIntPipe) requestId: number,
  ) {
    if (user.id !== id) {
      throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
    }
    const request = await this.usersService.getFriendRequestById(requestId);
    if (request.to.id !== user.id) {
      throw new HttpException('只有接收者能处理好友请求', HttpStatus.FORBIDDEN);
    }
    const fq = await this.usersService.updateFriendRequestStatus(
      request.id,
      FriendRequestType.ACCEPT,
    );
    await Promise.all([
      this.wsService.notifyNewFriend(fq.from.id, fq.to),
      this.wsService.notifyNewFriend(fq.to.id, fq.from),
    ]);
    return transformFriendRequest(fq);
  }

  @Put(':id/friends/requests/:requestId/reject')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '拒绝好友请求' })
  @ApiOkResponseResult({
    model: FriendRequestVo,
    description: '成功拒绝好友请求',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '权限不足',
  })
  async rejectFriendRequest(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Param('requestId', ParseIntPipe) requestId: number,
  ) {
    if (user.id !== id) {
      throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
    }
    const request = await this.usersService.getFriendRequestById(requestId);
    if (request.to.id !== user.id) {
      throw new HttpException('只有接收者能处理好友请求', HttpStatus.FORBIDDEN);
    }
    const fq = await this.usersService.updateFriendRequestStatus(
      request.id,
      FriendRequestType.REJECT,
    );
    return transformFriendRequest(fq);
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
