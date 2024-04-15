import { Inject, Injectable } from '@nestjs/common';
import { IChatroomsService } from './interface/chatrooms.service.interface';
import { Chatroom } from './entities/chatroom.entity';
import { CHATROOM_REPOSITORY } from 'src/common/constants/providers';
import { Brackets, Repository } from 'typeorm';
import { UserChatroom } from './entities/user-chatroom.entity';
import { ChatroomType } from 'src/common/constants/chatroom';

@Injectable()
export class ChatroomsService implements IChatroomsService {
  constructor(
    @Inject(CHATROOM_REPOSITORY)
    protected chatroomsRepository: Repository<Chatroom>,
  ) {}
  async getByUserIdAndFriendId(
    userId: number,
    friendId: number,
  ): Promise<Chatroom> {
    const chatroom = await this.chatroomsRepository
      .createQueryBuilder('chatroom')
      .innerJoinAndSelect('chatroom.userChatrooms', 'userChatroom')
      .where('chatroom.type = :type', { type: ChatroomType.SINGLE })
      .andWhere(
        new Brackets((qb) => {
          qb.where('userChatroom.user.id = :userId', { userId }).andWhere(
            'chatroom.id IN (SELECT chatroom_id FROM user_chatroom WHERE user_id = :friendId)',
            { friendId },
          );
        }),
      )
      .getOne();
    return chatroom;
  }
  async getByChatroomId(userId: number, chatroomId: number): Promise<Chatroom> {
    const query = this.chatroomsRepository
      .createQueryBuilder('chatroom')
      .innerJoinAndSelect(
        'chatroom.userChatrooms',
        'userChatroom',
        'userChatroom.chatroom.id = :chatroomId',
        { chatroomId },
      )
      .where('userChatroom.user.id = :userId', { userId });
    return await query.getOne();
  }
  async countAll(userId: number): Promise<number> {
    return userId;
  }
  async getAll(userId: number): Promise<Array<Chatroom>> {
    const query = this.chatroomsRepository
      .createQueryBuilder('chatroom')
      .innerJoinAndSelect(
        UserChatroom,
        'userChatroom',
        'userChatroom.chatroom.id = chatroom.id',
      )
      .where('userChatroom.user.id = :userId', { userId });
    return await query.getMany();
  }
}
