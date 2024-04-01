import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { IAddMessageDto } from './dto/add-message.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(protected readonly messagesService: MessagesService) {}
  @Get()
  @UseGuards()
  @ApiQuery({
    name: 'room_id',
    required: true,
    description: '消息所属聊天室的id',
    type: Number,
  })
  @ApiOperation({ summary: '根据roomId获取消息' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取聊天室消息',
    type: [Message],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  async getMessagesByChatroomId(
    @Query('room_id') roomId: number,
  ): Promise<Array<Message>> {
    return this.messagesService.getByPaging(roomId);
  }

  @Post()
  @UseGuards()
  @ApiOperation({ summary: '在聊天室中发送消息' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '成功发送消息',
    type: Message,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未认证用户',
  })
  async addMessage(@Body() partialMessage: IAddMessageDto): Promise<Message> {
    const message = await this.messagesService.addMessage(partialMessage);
    return message;
  }
}
