import { ApiProperty } from '@nestjs/swagger';
import { ChatroomType } from 'src/common/constants/chatroom';

export class ChatroomVo {
  @ApiProperty({ example: 987654321, description: '房间号' })
  id: number;

  @ApiProperty({
    example: ChatroomType.SINGLE,
    description: '聊天室类型(单聊、多聊)',
  })
  type: ChatroomType;

  @ApiProperty({ example: 'chatroomName', description: '聊天室名字' })
  name: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/88575063?v=4',
    description: '聊天室的头像 当为单聊的时候为对方的头像',
  })
  avatarUrl: string;

  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '聊天室建立时间',
  })
  createTime: string;
}
