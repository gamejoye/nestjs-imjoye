import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class VisitChatroomDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-04-23 21:45',
    description: '访问聊天室的最后时间戳',
  })
  timestamp: string;
}
