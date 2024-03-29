import { ApiProperty } from '@nestjs/swagger';
import { Chatroom } from 'src/modules/chatrooms/entities/chatroom.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 987654321, description: '消息id' })
  id: number;

  @ManyToOne(() => Chatroom)
  @JoinColumn({ name: 'chatroom_id' })
  @ApiProperty({
    description: '消息所属聊天室',
  })
  chatroom: Chatroom;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'from' })
  @ApiProperty({ description: '消息由谁发出' })
  from: User;

  @Column()
  @ApiProperty({ example: '你好，很高兴认识你', description: '消息内容' })
  content: string;

  @Column({ name: 'create_time' })
  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '消息创建时间',
  })
  createTime: string;
}
