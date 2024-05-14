import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetChatroomSummaryDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-04-23 21:45',
    description: '最后一次访问聊天室的时间戳',
  })
  readonly timestamp: string;
}
