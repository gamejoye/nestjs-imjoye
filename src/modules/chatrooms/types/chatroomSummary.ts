import { Message } from 'src/modules/messages/entities/message.entity';
import { Chatroom } from '../entities/chatroom.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ChatroomSummary {
  @ApiProperty({ description: '当前聊天室的最新一条消息' })
  latestMessage: Message | null;

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
  })
  onlineUserIds: Array<number>;

  @ApiProperty({
    description: '当前summary记录所对应的chatroom',
    type: () => Chatroom,
  })
  chatroom: Chatroom;
}
