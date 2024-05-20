import { ApiProperty } from '@nestjs/swagger';

export class UserVo {
  @ApiProperty({ example: 987654321, description: '唯一主键' })
  id: number;

  @ApiProperty({ example: 'gamejoye', description: '用户名' })
  username: string;

  @ApiProperty({ example: 'gamejoye@gmail.com', description: '用户名邮箱' })
  email: string;

  @ApiProperty({
    example: 'https://gamejoye.top/static/media/bg.6885a3ed90df348b4f7a.jpeg',
    description: '用户头像',
  })
  avatarUrl: string;

  @ApiProperty({
    example: '天天开心， 天天向上',
    description: '用户个性签名',
  })
  description: string;

  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '注册时间',
  })
  createTime: string;
}
