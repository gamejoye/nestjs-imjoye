import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

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
  async getByChatroomId(
    @Query('room_id') roomId: number,
  ): Promise<Array<Message>> {
    return this.messagesService.getByPaging(roomId);
  }
}
