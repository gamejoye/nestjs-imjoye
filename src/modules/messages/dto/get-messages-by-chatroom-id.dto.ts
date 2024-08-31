import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { canTransformToInt } from 'src/common/utils/number';

export class GetMessagesDto {
  @Transform(({ value }: { value: string }) => {
    if (canTransformToInt(value)) return Number(value);
    return NaN;
  })
  @IsInt()
  @ApiProperty({
    example: 2,
    description: '房间id',
  })
  room_id: number;

  @Transform(({ value }: { value: string }) => {
    if (canTransformToInt(value)) return Number(value);
    return NaN;
  })
  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 2,
    description: '最后一条消息的id',
    required: false,
  })
  oldest_message_id?: number;

  @Transform(({ value }: { value: string }) => {
    if (canTransformToInt(value)) return Number(value);
    return NaN;
  })
  @IsInt()
  @ApiProperty({
    example: 2,
    description: '拉取的消息的数量',
  })
  page_size: number;
}
