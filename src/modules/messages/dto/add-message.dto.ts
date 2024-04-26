import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class IAddMessageChatroomDto {
  @IsNumber()
  @ApiProperty({
    examples: [1, 2, 3, 4, 5],
    description: '待添加消息所属聊天室id',
  })
  id: number;
}

class IAddMessageFromDto {
  @IsNumber()
  @ApiProperty({
    examples: [7, 8, 9, 10],
    description: '待添加消息发送者的id',
  })
  id: number;
}

export class IAddMessageDto {
  @IsNumber()
  @ApiProperty({
    examples: [124, 5125],
    description: '前端用于展示loading Message所需要使用的暂时id',
  })
  temporaryId: number;

  @ValidateNested()
  @Type(() => IAddMessageChatroomDto)
  @ApiProperty({
    examples: [{ id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }],
    description: '待添加消息所需要的chatroom的基本信息',
  })
  chatroom: IAddMessageChatroomDto;

  @ValidateNested()
  @Type(() => IAddMessageFromDto)
  @ApiProperty({
    examples: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    description: '待添加消息所需要的发送者的基本信息',
  })
  from: IAddMessageFromDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    examples: ['如有天樱花再开', '无爱自是不能爱人'],
    description: '消息的内容',
  })
  content: string;
}
