import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatroomsService } from './chatrooms.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../auth/jwt.guard';
import { MessagesService } from '../messages/messages.service';
import { GetSingleChatroomDto } from './dto/get-single-chatroom.dto';
import { Logger } from 'src/common/utils';
import { UserChatroomService } from './user-chatroom.service';
import { VisitChatroomDto } from './dto/visit-chatroom.dto';
import { ChatroomVo } from './vo/chatroom.vo';
import { ChatroomSummaryVo } from './vo/chatroom-summary.vo';
import { transformChatroom } from './vo/utils';
import { transformMessage } from '../messages/vo/utils';
import {
  ApiBaseResult,
  ApiOkResponseResult,
} from 'src/common/types/response.type';

@ApiExtraModels(ApiBaseResult)
@ApiTags('chatrooms')
@Controller('chatrooms')
export class ChatroomsController {
  constructor(
    protected readonly chatroomsService: ChatroomsService,
    protected readonly userChatroomService: UserChatroomService,
    protected readonly messagesService: MessagesService,
  ) {}

  @Put(':chatroomId/visit')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '更新用户对于聊天室的最后访问时间' })
  @ApiOkResponseResult({
    model: 'string',
    description: '成功更新用户访问聊天室的最后时间',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '聊天室不存在或者无权访问',
  })
  async visitChatroom(
    @GetUser() user: User,
    @Query() { timestamp }: VisitChatroomDto,
    @Param('chatroomId', ParseIntPipe) chatroomId: number,
  ): Promise<string> {
    const userChatroom = await this.userChatroomService.updateLatestVisitTime(
      user.id,
      chatroomId,
      timestamp,
    );
    if (!userChatroom) {
      throw new NotFoundException('聊天室不存在或者无权访问');
    }
    return '';
  }

  @Get('')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '根据userId和friendId获取单个单聊聊天室' })
  @ApiOkResponseResult({
    model: ChatroomVo,
    description: '成功获取单个聊天室',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '未找到聊天室',
  })
  async getSingleChatroomByFriendId(
    @GetUser() user: User,
    @Query() { friend_id: friendId }: GetSingleChatroomDto,
  ): Promise<ChatroomVo> {
    const chatroom = await this.chatroomsService.getByUserIdAndFriendId(
      user.id,
      friendId,
    );
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }
    return transformChatroom(chatroom);
  }

  @Get('summaries')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '获取聊天室信息概要' })
  @ApiOkResponseResult({
    model: ChatroomSummaryVo,
    description: '成功获取chatroomSummaries',
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  async getChatroomSummaries(
    @GetUser() user: User,
  ): Promise<Array<ChatroomSummaryVo>> {
    const chatrooms = await this.chatroomsService.getAll(user.id);

    const summaries: Array<ChatroomSummaryVo> = await Promise.all(
      chatrooms.map(async (chatroom) => {
        const userChatroom =
          await this.userChatroomService.getByUserIdAndChatroomId(
            user.id,
            chatroom.id,
          );
        const timestamp = userChatroom.latestVisitTime;
        const latestMessage =
          await this.messagesService.getLatestMessageByChatroomId(chatroom.id);
        const unreadMessageCount = await this.messagesService.countByTime(
          chatroom.id,
          timestamp,
        );
        return {
          chatroom: transformChatroom(chatroom),
          latestMessage: latestMessage
            ? transformMessage(latestMessage)
            : undefined,
          joinTime: userChatroom.createTime,
          latestVisitTime: userChatroom.latestVisitTime,
          unreadMessageCount,
          onlineUserIds: [],
        };
      }),
    );
    Logger.log(summaries);
    return summaries;
  }

  @Get(':chatroomId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '根据聊天室id获取单个聊天室' })
  @ApiOkResponseResult({
    model: ChatroomVo,
    description: '成功获取单个聊天室',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '未找到聊天室',
  })
  async getChatroom(
    @GetUser() user: User,
    @Param('chatroomId', ParseIntPipe) chatroomId: number,
  ): Promise<ChatroomVo> {
    const chatroom = await this.chatroomsService.getByChatroomId(
      user.id,
      chatroomId,
    );
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }
    return transformChatroom(chatroom);
  }

  @Get('summaries/:chatroomId')
  @UseGuards(JwtGuard)
  @ApiOkResponseResult({
    model: ChatroomSummaryVo,
    description: '成功获取单个聊天室的chatroomSummaries',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  async getChatroomSummary(
    @GetUser() user: User,
    @Param('chatroomId', ParseIntPipe) chatroomId: number,
  ): Promise<ChatroomSummaryVo> {
    const chatroom = await this.chatroomsService.getByChatroomId(
      user.id,
      chatroomId,
    );
    if (!chatroom) {
      throw new HttpException(
        '不存在或无权访问对应聊天室',
        HttpStatus.NOT_FOUND,
      );
    }
    const userChatroom =
      await this.userChatroomService.getByUserIdAndChatroomId(
        user.id,
        chatroomId,
      );
    const timestamp = userChatroom.latestVisitTime;
    const unreadMessageCount = await this.messagesService.countByTime(
      chatroom.id,
      timestamp,
    );
    const latestMessage =
      await this.messagesService.getLatestMessageByChatroomId(chatroomId);
    const summary: ChatroomSummaryVo = {
      chatroom: transformChatroom(chatroom),
      latestVisitTime: userChatroom.latestVisitTime,
      joinTime: userChatroom.createTime,
      latestMessage: latestMessage
        ? transformMessage(latestMessage)
        : undefined,
      unreadMessageCount,
      onlineUserIds: [],
    };
    return summary;
  }
}
