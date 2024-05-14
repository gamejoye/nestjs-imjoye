import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetSingleChatroomDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 2,
    description: '好友id',
  })
  friend_id: number;
}
