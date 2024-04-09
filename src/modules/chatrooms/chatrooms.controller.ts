import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatroomSummary } from './types/chatroomSummary';
import { GetChatroomSummariesDto } from './dto/get-chatroom-summary.dto';
import { ChatroomsService } from './chatrooms.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../auth/jwt.guard';
import { MessagesService } from '../messages/messages.service';

@ApiTags('chatrooms')
@Controller('chatrooms')
export class ChatroomsController {
  constructor(
    protected readonly chatroomsService: ChatroomsService,
    protected readonly messagesService: MessagesService,
  ) {}
  @Post('summaries')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ApiBody({ type: GetChatroomSummariesDto })
  @ApiOperation({ summary: '获取聊天室信息概要' })
  @ApiResponse({
    status: HttpStatus.CREATED,
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
