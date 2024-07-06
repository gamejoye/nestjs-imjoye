import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetUserByEmailDto {
  @IsEmail()
  @ApiProperty({
    example: 'gamejoye@gmail.com',
    description: '待查询的用户邮箱',
  })
  email: string;
}
