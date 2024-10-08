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
  Query,
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
import { GetUserByEmailDto } from './dto/get-user-by-email.dto';
import { ChatroomsService } from '../chatrooms/chatrooms.service';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly chatroomsService: ChatroomsService,
    protected readonly wsService: WsGatewayService,
    protected readonly configService: ConfigService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: '根据userId获取用户' })
  @ApiOkResponseResult({
    model: UserVo,
    description: '成功获取用户',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '未找到用户',
  })
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserVo> {
    const target = await this.usersService.getById(id);
    if (!target) {
      throw new HttpException('不存在的用户', HttpStatus.NOT_FOUND);
    }
    return transformUser(target);
  }

  @Get()
  @ApiOperation({ summary: '根据email获取用户' })
  @ApiOkResponseResult({
    model: UserVo,
    description: '成功根据email获取用户',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '不存在的邮箱',
  })
  async getUserByEmail(@Query() query: GetUserByEmailDto): Promise<UserVo> {
    const { email } = query;
    const target = await this.usersService.getByEmail(email);
    if (!target) {
      throw new HttpException('不存在的邮箱', HttpStatus.NOT_FOUND);
    }
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
    if (fq.status === FriendRequestType.ACCEPT) {
      const chatroom = await this.chatroomsService.getByUserIdAndFriendId(
        fq.from.id,
        fq.to.id,
      );
      // 通知发送者和接收者有新的聊天室
      await Promise.all([
        this.wsService.notifyNewChatroom(fq.from.id, chatroom),
        this.wsService.notifyNewChatroom(fq.to.id, chatroom),
      ]);
      // 通知发送者和接收者有新的好友
      await Promise.all([
        this.wsService.notifyNewFriend(fq.from.id, fq.to),
        this.wsService.notifyNewFriend(fq.to.id, fq.from),
      ]);
    }
    await Promise.all([
      this.wsService.notifyNewFriendRequest(fq.to.id, fq),
      this.wsService.notifyNewFriendRequest(fq.from.id, fq),
    ]);
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
    const request = await this.usersService.getFriendRequestById(requestId);
    if (user.id !== id || request.to.id !== user.id) {
      throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
    }
    const fq = await this.usersService.updateFriendRequestStatus(
      request.id,
      FriendRequestType.ACCEPT,
    );
    const chatroom = await this.chatroomsService.getByUserIdAndFriendId(
      fq.from.id,
      fq.to.id,
    );
    await Promise.all([
      this.wsService.notifyNewChatroom(fq.from.id, chatroom),
      this.wsService.notifyNewChatroom(fq.to.id, chatroom),
    ]);
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
    const request = await this.usersService.getFriendRequestById(requestId);
    if (user.id !== id || request.to.id !== user.id) {
      throw new HttpException('权限不足', HttpStatus.FORBIDDEN);
    }
    const fq = await this.usersService.updateFriendRequestStatus(
      request.id,
      FriendRequestType.REJECT,
    );
    // 通知请求的发送者请求被拒绝了
    await Promise.all([
      this.wsService.notifyNewFriendRequest(fq.from.id, fq),
      this.wsService.notifyNewFriendRequest(fq.to.id, fq),
    ]);
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
    const avatarUrl = this.configService.get<Config['avatar']>('avatar').url;
    const userAvatarUrl = avatarUrl + '/' + filename;
    return userAvatarUrl;
  }
}
