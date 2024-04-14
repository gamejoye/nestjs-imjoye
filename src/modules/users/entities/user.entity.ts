import { ApiProperty } from '@nestjs/swagger';
import { UserChatroom } from 'src/modules/chatrooms/entities/user-chatroom.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserFriendship } from './friendship.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 987654321, description: '唯一主键' })
  id: number;

  @Column()
  @ApiProperty({ example: 'gamejoye', description: '用户名' })
  username: string;

  @Column()
  @ApiProperty({ example: 'gamejoye@gmail.com', description: '用户名邮箱' })
  email: string;

  @Column({ name: 'password_hash' })
  @ApiProperty({ example: 'xxxxx', description: '经过hash之后的密码' })
  passwordHash: string;

  @Column({ name: 'avatar_url' })
  @ApiProperty({
    example: 'https://gamejoye.top/static/media/bg.6885a3ed90df348b4f7a.jpeg',
    description: '用户头像',
  })
  avatarUrl: string;

  @Column()
  @ApiProperty({
    example: '天天开心， 天天向上',
    description: '用户个性签名',
  })
  description: string;

  @Column({ name: 'create_time' })
  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '注册时间',
  })
  createTime: string;

  @OneToMany(() => UserChatroom, (userChatroom) => userChatroom.user)
  userChatrooms: Array<UserChatroom>;

  @OneToMany(() => UserFriendship, (friendship) => friendship.from)
  fromFriendships: Array<UserFriendship>;

  @OneToMany(() => UserFriendship, (friendship) => friendship.to)
  toFriendships: Array<UserFriendship>;
}
