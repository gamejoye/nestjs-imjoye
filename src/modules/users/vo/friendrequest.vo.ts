import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestType } from 'src/common/constants/friendrequest';
import { UserVo } from './user.vo';

export class FriendRequestVo {
  @ApiProperty({ example: 1, description: 'FriendRequest ID' })
  id: number;

  @ApiProperty({
    example: '2024-03-23 19:12',
    description: 'friendrequest创建时间',
  })
  createTime: string;

  @ApiProperty({
    example: '2024-03-23 19:15',
    description: 'friendrequest更新时间',
  })
  updateTime: string;

  @ApiProperty({
    example: FriendRequestType.PENDING,
    description: '好友之间的关系',
    enum: FriendRequestType,
  })
  status: FriendRequestType;

  @ApiProperty({
    description: '好友请求发送者',
  })
  from: UserVo;

  @ApiProperty({
    description: '好友请求接收者',
  })
  to: UserVo;
}
