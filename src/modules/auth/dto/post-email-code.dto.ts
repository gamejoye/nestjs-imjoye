import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PostEmailCodeDto {
  @IsEmail()
  @ApiProperty({ example: 'gamejoye@gmail.com', description: '用户邮箱' })
  email: string;
}
