import { ApiProperty } from '@nestjs/swagger';

export class PostEmailCodeVo {
  @ApiProperty({
    description: '验证码有效时间',
    example: 60,
  })
  validTime: number;
}
