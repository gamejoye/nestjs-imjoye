import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { canTransformToInt } from 'src/common/utils/number';

export class GetMessagesByChatroomIdDto {
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
}
