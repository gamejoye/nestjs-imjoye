import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { canTransformToInt } from 'src/common/utils/number';

export class GetSingleChatroomDto {
  @Transform(({ value }: { value: string }) => {
    if (canTransformToInt(value)) return Number(value);
    return NaN;
  })
  @IsInt()
  @ApiProperty({
    example: 2,
    description: '好友id',
  })
  friend_id: number;
}
