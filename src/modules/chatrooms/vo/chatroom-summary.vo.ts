import { ApiProperty } from '@nestjs/swagger';
import { ChatroomVo } from './chatroom.vo';
import { MessageVo } from 'src/modules/messages/vo/message.vo';

export class ChatroomSummaryVo {
  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '当前聊天室最后一次用户的访问时间 最早为用户加入聊天室的时间',
  })
  latestVisitTime: string;

  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '用户加入聊天室的时间',
  })
  joinTime: string;

  @ApiProperty({
    examples: [1, 55, 0, 199],
    description: '当前聊天室用户未读的消息数量',
  })
  unreadMessageCount: number;

  @ApiProperty({
    example: [21, 2642, 366, 4453, 576, 641, 712],
    description: '当前聊天室在线用户的id数组',
    type: Number,
    isArray: true,
  })
  onlineUserIds: Array<number>;

  @ApiProperty({
    description: '当前summary记录所对应的chatroom',
    type: ChatroomVo,
  })
  chatroom: ChatroomVo;

  @ApiProperty({ description: '当前聊天室的最新一条消息' })
  latestMessage?: MessageVo;
}
