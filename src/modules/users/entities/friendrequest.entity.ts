import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestType } from 'src/common/constants/friendrequest';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'FriendRequest ID' })
  id: number;

  @Column({ name: 'create_time' })
  @ApiProperty({
    example: '2024-03-23 19:12',
    description: 'friendrequest创建时间',
  })
  createTime: string;

  @Column({ name: 'update_time' })
  @ApiProperty({
    example: '2024-03-23 19:15',
    description: 'friendrequest更新时间',
  })
  updateTime: string;

  @Column({
    type: 'enum',
    enum: FriendRequestType,
    default: FriendRequestType.PENDING,
  })
  @ApiProperty({
    example: FriendRequestType.PENDING,
    description: '好友之间的关系',
    enum: FriendRequestType,
  })
  status: FriendRequestType;

  @ManyToOne(() => User, (user) => user.fromFriendRequests)
  @JoinColumn({ name: 'from_id' })
  from: User;

  @ManyToOne(() => User, (user) => user.toFriendRequests)
  @JoinColumn({ name: 'to_id' })
  to: User;
}
