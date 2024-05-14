import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chatroom } from './chatroom.entity';

@Entity()
export class UserChatroom {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 987654321, description: 'key标识' })
  id: number;

  @Column({ name: 'create_time' })
  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '用户加入聊天室的时间',
  })
  createTime: string;

  @Column({ name: 'latest_visit_time' })
  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '用户最后一次访问聊天室的时候 最早为用户加入聊天室的时间',
  })
  latestVisitTime: string;

  @ManyToOne(() => User, (user) => user.userChatrooms)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Chatroom, (chatroom) => chatroom.userChatrooms)
  @JoinColumn({ name: 'chatroom_id' })
  chatroom: Chatroom;
}
