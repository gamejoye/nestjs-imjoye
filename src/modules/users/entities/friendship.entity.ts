import { ApiProperty } from '@nestjs/swagger';
import { UserFriendshipType } from 'src/common/constants/friendship';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class UserFriendship {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Friendship ID' })
  id: number;

  @Column({
    type: 'enum',
    enum: UserFriendshipType,
    default: UserFriendshipType.PENDING,
  })
  @ApiProperty({
    example: UserFriendshipType.PENDING,
    description: '好友之间的关系',
  })
  status: UserFriendshipType;

  @Column({ name: 'create_time' })
  @ApiProperty({
    example: '2024-03-23 19:12',
    description: 'friendship创建时间',
  })
  createTime: string;

  @Column({ name: 'update_time' })
  @ApiProperty({
    example: '2024-03-23 19:15',
    description: 'friendship最后更新时间',
  })
  updateTime: string;

  @ManyToOne(() => User, (user) => user.fromFriendships)
  @JoinColumn({ name: 'from_id' })
  from: User;

  @ManyToOne(() => User, (user) => user.toFriendships)
  @JoinColumn({ name: 'to_id' })
  to: User;
}
