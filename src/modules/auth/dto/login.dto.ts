import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserRequestDto {
  @IsEmail()
  @ApiProperty({ example: 'gamejoye@gmail.com', description: '用户邮箱' })
  email: string;

  @IsString()
  @ApiProperty({ example: '147jkl...', description: '用户密码' })
  password: string;
}
