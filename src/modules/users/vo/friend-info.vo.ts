import { UserVo } from './user.vo';
import { ApiProperty } from '@nestjs/swagger';

export class FriendInfoVo {
  @ApiProperty({
    description: '好友的基本信息',
    type: UserVo,
  })
  user: UserVo;
  @ApiProperty({
    description: '好友请求创建的时间',
    example: '2024-05-20 19:12',
  })
  createTime: string;
}
