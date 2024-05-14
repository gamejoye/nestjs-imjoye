import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

class GetChatroomSummaryDto {
  @IsInt()
  @ApiProperty({ example: 11234889, description: '聊天室id' })
  readonly id: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '最后一次用户访问当前聊天室的时间',
  })
  readonly latestVisitTime: string;
}

export class GetChatroomSummariesDto {
  @IsArray()
  @ValidateNested()
  @Type(() => GetChatroomSummaryDto)
  @ApiProperty({
    example: [
      { id: 11234889, latestVisitTime: '2024-03-23 19:12' },
      { id: 12481287, latestVisitTime: '2024-03-21 14:55' },
    ],
    description: '最后一次用户访问各个聊天室的信息',
  })
  latestVisitTimes: Array<GetChatroomSummaryDto>;
}
