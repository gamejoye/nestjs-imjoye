import { ApiProperty } from '@nestjs/swagger';
import { ChatroomType } from 'src/common/constants/chatroom';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserChatroom } from './user-chatroom.entity';
import { Message } from 'src/modules/messages/entities/message.entity';

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 987654321, description: '房间号' })
  id: number;

  @Column()
  @ApiProperty({
    example: ChatroomType.SINGLE,
    description: '聊天室类型(单聊、多聊)',
  })
  type: ChatroomType;

  @Column()
  @ApiProperty({ example: 'chatroomName', description: '聊天室名字' })
  name: string;

  @Column({ name: 'avatar_url' })
  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/88575063?v=4',
    description: '聊天室的头像 当为单聊的时候为对方的头像',
  })
  avatarUrl: string;

  @Column({ name: 'create_time' })
  @ApiProperty({
    example: '2024-03-23 19:12',
    description: '聊天室建立时间',
  })
  createTime: string;

  @OneToMany(() => UserChatroom, (userChatroom) => userChatroom.chatroom)
  userChatrooms: Array<UserChatroom>;

  @OneToMany(() => Message, (message) => message.chatroom)
  messages: Array<Message>;
}
