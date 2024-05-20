import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetChatroomSummaryDto {
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-04-23 21:45',
    description: '最后一次访问聊天室的时间戳',
  })
  readonly timestamp?: string;
}
