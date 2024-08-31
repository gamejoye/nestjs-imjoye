import { ApiProperty } from '@nestjs/swagger';
import { MessageVo } from './message.vo';

export class PagingMessagesVo {
  @ApiProperty({
    example: true,
    description: '是否还有未获取的消息',
  })
  more: boolean;

  @ApiProperty({
    description: '消息内容',
    type: MessageVo,
    isArray: true,
  })
  messages: Array<MessageVo>;
}
