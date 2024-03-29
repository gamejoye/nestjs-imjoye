import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterUserRequestDto {
  @IsString()
  @ApiProperty({ example: 'gamejoye', description: '用户名' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'gamejoye@gmail.com', description: '用户邮箱' })
  email: string;

  @IsString()
  @ApiProperty({ example: '147jkl...', description: '用户密码' })
  password: string;

  @IsString()
  @ApiProperty({
    example: 'https://gamejoye.top/static/media/bg.6885a3ed90df348b4f7a.jpeg',
    description: '用户头像',
  })
  avatarUrl: string;
}
