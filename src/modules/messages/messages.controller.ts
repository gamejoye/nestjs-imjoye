import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { IAddMessageDto } from './dto/add-message.dto';
import { WsGatewayService } from '../ws-gateway/ws-gateway.service';
import { MessageVo } from './vo/message.vo';
import { transformMessage } from './vo/utils';
import { GetMessagesDto } from './dto/get-messages-by-chatroom-id.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ChatroomsService } from '../chatrooms/chatrooms.service';
import {
  ApiBaseResult,
  ApiCreatedResponseResult,
  ApiOkResponseResult,
} from 'src/common/types/response.type';
import { PagingMessagesVo } from './vo/pagine-messages.vo';
import { Logger } from 'src/common/utils';

@ApiExtraModels(ApiBaseResult)
@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(
    protected readonly messagesService: MessagesService,
    protected readonly chatroomsService: ChatroomsService,
    protected readonly wsService: WsGatewayService,
  ) {}
  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '根据roomId获取消息' })
  @ApiOkResponseResult({
    model: PagingMessagesVo,
    description: '成功获取聊天室消息',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '聊天室不存在',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  async getMessagesByChatroomId(
    @GetUser() user: User,
    @Query() { room_id: roomId, oldest_message_id, page_size }: GetMessagesDto,
  ): Promise<PagingMessagesVo> {
    const chatroom = await this.chatroomsService.getByChatroomId(
      user.id,
      roomId,
    );
    if (!chatroom) {
      throw new HttpException('聊天室不存在', HttpStatus.NOT_FOUND);
    }
    const messages = await this.messagesService.getByOldestPaging(roomId, {
      oldest_message_id,
      page_size: page_size + 1,
    });
    Logger.log('msgs: ', messages);
    return {
      more: messages.length === page_size + 1,
      messages: messages
        .slice(0, Math.min(messages.length, page_size))
        .map((message) => transformMessage(message)),
    };
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '在聊天室中发送消息' })
  @ApiBody({ type: IAddMessageDto })
  @ApiCreatedResponseResult({
    model: MessageVo,
    description: '成功发送消息',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '资源不存在',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '无法在该聊天室发送消息',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  async addMessage(@Body() partialMessage: IAddMessageDto): Promise<MessageVo> {
    const message = await this.messagesService.addMessage(partialMessage);
    await this.wsService.notifynChat(message.from.id, message);
    return transformMessage(message);
  }
}
