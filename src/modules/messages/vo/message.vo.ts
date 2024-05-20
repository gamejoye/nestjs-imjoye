import { ApiProperty } from '@nestjs/swagger';
import { ChatroomVo } from 'src/modules/chatrooms/vo/chatroom.vo';
import { UserVo } from 'src/modules/users/vo/user.vo';

export class MessageVo {
  @ApiProperty({ example: 987654321, description: '消息id' })
  id: number;

  @ApiProperty({ example: 4751776, description: '消息的暂时id从前端传来' })
  temporaryId?: number;

  @ApiProperty({
    description: '消息所属聊天室',
    type: ChatroomVo,
  })
  chatroom: ChatroomVo;

  @ApiProperty({
    description: '消息由谁发出',
    type: UserVo,
  })
  from: UserVo;

  @ApiProperty({ example: '你好，很高兴认识你', description: '消息内容' })
  content: string;

  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '消息创建时间',
  })
  createTime: string;
}
