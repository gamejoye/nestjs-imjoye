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
import { ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { IAddMessageDto } from './dto/add-message.dto';
import { WsGatewayService } from '../ws-gateway/ws-gateway.service';
import { MessageVo } from './vo/message.vo';
import { transformMessage } from './vo/utils';
import { GetMessagesByChatroomIdDto } from './dto/get-messages-by-chatroom-id.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ChatroomsService } from '../chatrooms/chatrooms.service';
import {
  ApiBaseResult,
  ApiCreatedResponseResult,
  ApiOkResponseResult,
} from 'src/common/types/response.type';

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
  @ApiOperation({ summary: '根据roomId获取消息' })
  @ApiOkResponseResult({
    model: MessageVo,
    description: '成功获取聊天室消息',
    isArray: true,
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
    @Query() { room_id: roomId }: GetMessagesByChatroomIdDto,
  ): Promise<Array<MessageVo>> {
    const chatroom = await this.chatroomsService.getByChatroomId(
      user.id,
      roomId,
    );
    if (!chatroom) {
      throw new HttpException('聊天室不存在', HttpStatus.NOT_FOUND);
    }
    const messages = await this.messagesService.getByPaging(roomId);
    return messages.map((message) => transformMessage(message));
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
