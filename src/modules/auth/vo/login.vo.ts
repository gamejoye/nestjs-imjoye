import { ApiProperty } from '@nestjs/swagger';

export class LoginVo {
  @ApiProperty({
    description: '用户id',
    examples: [1, 2, 7, 99, 12412],
  })
  id: number;
  @ApiProperty({
    description: '用户登录成功后的认证信息',
  })
  token: string;
}
