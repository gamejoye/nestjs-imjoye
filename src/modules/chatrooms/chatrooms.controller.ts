import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatroomSummary } from './types/chatroomSummary';
import { GetChatroomSummariesDto } from './dto/get-chatroom-summaries.dto';
import { ChatroomsService } from './chatrooms.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../auth/jwt.guard';
import { MessagesService } from '../messages/messages.service';
import { Chatroom } from './entities/chatroom.entity';
import { GetChatroomSummaryDto } from './dto/get-chatroom-summary.dto';
import { GetSingleChatroomDto } from './dto/get-single-chatroom.dto';
import { Logger } from 'src/common/utils';
import { UserChatroomService } from './user-chatroom.service';
import { VisitChatroomDto } from './dto/visit-chatroom.dto';

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
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '成功更新用户访问聊天室的最后时间',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '聊天室不存在或者无权访问',
  })
  async visitChatroom(
    @GetUser() user: User,
    @Query() { timestamp }: VisitChatroomDto,
    @Param('chatroomId') chatroomId: number,
  ): Promise<void> {
    const userChatroom = await this.userChatroomService.updateLatestVisitTime(
      user.id,
      chatroomId,
      timestamp,
    );
    if (!userChatroom) {
      throw new NotFoundException('聊天室不存在或者无权访问');
    }
  }

  @Get(':chatroomId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '根据聊天室id获取单个聊天室' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取单个聊天室',
    type: Chatroom,
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
    @Param('id') chatroomId: number,
  ): Promise<Chatroom> {
    const chatroom = await this.chatroomsService.getByChatroomId(
      user.id,
      chatroomId,
    );
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }
    return chatroom;
  }

  @Get('')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '根据userId和friendId获取单个单聊聊天室' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取单个单聊聊天室',
    type: Chatroom,
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
  ): Promise<Chatroom> {
    const chatroom = await this.chatroomsService.getByUserIdAndFriendId(
      user.id,
      friendId,
    );
    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }
    return chatroom;
  }

  @Get('summaries/:chatroomId')
  @UseGuards(JwtGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取单个聊天室的chatroomSummaries',
    type: ChatroomSummary,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
    type: ChatroomSummary,
  })
  async getChatroomSummary(
    @GetUser() user: User,
    @Param('chatroomId') chatroomId: number,
    @Query() { timestamp }: GetChatroomSummaryDto,
  ): Promise<ChatroomSummary> {
    Logger.log(chatroomId, timestamp);
    const chatroom = await this.chatroomsService.getByChatroomId(
      user.id,
      chatroomId,
    );
    Logger.log(chatroom);
    if (!chatroom) {
      throw new HttpException(
        '不存在或无权访问对应聊天室',
        HttpStatus.NOT_FOUND,
      );
    }
    const unreadMessageCount = await this.messagesService.countByTime(
      chatroom.id,
      timestamp,
    );
    const latestMessage =
      await this.messagesService.getLatestMessageByChatroomId(chatroomId);
    const userChatroom =
      await this.userChatroomService.getByUserIdAndChatroomId(
        user.id,
        chatroomId,
      );
    const summary: ChatroomSummary = {
      chatroom,
      latestVisitTime: timestamp,
      joinTime: userChatroom.createTime,
      latestMessage,
      unreadMessageCount,
      onlineUserIds: [],
    };
    return summary;
  }

  @Post('summaries')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ApiBody({ type: GetChatroomSummariesDto })
  @ApiOperation({ summary: '获取聊天室信息概要' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取chatroomSummaries',
    type: [ChatroomSummary],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
    type: [ChatroomSummary],
  })
  async getChatroomSummaries(
    @GetUser() user: User,
    @Body() getChatroomSummariesDto: GetChatroomSummariesDto,
  ): Promise<Array<ChatroomSummary>> {
    const chatrooms = await this.chatroomsService.getAll(user.id);
    const chatroomIds = chatrooms.map(({ id }) => id);
    const latestTimesMap = new Map<number, string>();
    getChatroomSummariesDto.latestVisitTimes
      .filter(
        ({ id }) => chatroomIds.findIndex((joinedId) => joinedId == id) !== -1,
      )
      .forEach(({ id, latestVisitTime }) => {
        latestTimesMap.set(id, latestVisitTime);
      });

    const latestMessages = await Promise.all(
      chatrooms.map(({ id }) =>
        this.messagesService.getLatestMessageByChatroomId(id),
      ),
    );
    const unreadMessageCounts = await Promise.all(
      chatrooms.map(({ id, createTime }) =>
        this.messagesService.countByTime(
          id,
          latestTimesMap.get(id) || createTime,
        ),
      ),
    );

    const summaries: Array<ChatroomSummary> = await Promise.all(
      chatrooms.map(async (chatroom, index) => {
        const partialLatestMessage = latestMessages[index];
        if (partialLatestMessage) {
          partialLatestMessage.chatroom = chatroom;
        }
        const userChatroom =
          await this.userChatroomService.getByUserIdAndChatroomId(
            user.id,
            chatroom.id,
          );
        const latestVisitTime =
          latestTimesMap.get(chatroom.id) || userChatroom.createTime;
        return {
          chatroom,
          latestMessage: partialLatestMessage,
          joinTime: userChatroom.createTime,
          latestVisitTime,
          unreadMessageCount: unreadMessageCounts[index],
          onlineUserIds: [],
        };
      }),
    );
    Logger.log(summaries);
    return summaries;
  }
}
