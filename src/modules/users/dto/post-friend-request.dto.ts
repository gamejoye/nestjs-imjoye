import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PostFriendRequestDto {
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: '发起请求的用户id',
  })
  from: number;

  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: '接收者的用户id',
  })
  to: number;
}
