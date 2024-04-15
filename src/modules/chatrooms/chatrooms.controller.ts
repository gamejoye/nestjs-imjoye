import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
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

@ApiTags('chatrooms')
@Controller('chatrooms')
export class ChatroomsController {
  constructor(
    protected readonly chatroomsService: ChatroomsService,
    protected readonly messagesService: MessagesService,
  ) {}

  @Get(':id')
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
    @Query('friend_id') friendId: number,
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

    const summaries: Array<ChatroomSummary> = chatrooms.map(
      (chatroom, index) => {
        const partialLatestMessage = latestMessages[index];
        if (partialLatestMessage) {
          partialLatestMessage.chatroom = chatroom;
        }
        return {
          chatroom,
          latestMessage: partialLatestMessage,
          latestVisitTime: latestTimesMap.get(chatroom.id) ?? null,
          unreadMessageCount: unreadMessageCounts[index],
          onlineUserIds: [],
        };
      },
    );
    return summaries;
  }
}
