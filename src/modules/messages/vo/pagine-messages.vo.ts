import { ApiProperty } from '@nestjs/swagger';
import { MessageVo } from './message.vo';

export class PagingMessagesVo {
  @ApiProperty({
    example: 100,
    description: '消息总数',
  })
  total: number;

  @ApiProperty({
    description: '消息内容',
    type: MessageVo,
    isArray: true,
  })
  messages: Array<MessageVo>;
}
