import { Inject, Injectable } from '@nestjs/common';
import { IChatroomsService } from './interface/chatrooms.service.interface';
import { Chatroom } from './entities/chatroom.entity';
import { CHATROOM_REPOSITORY } from 'src/common/constants/providers';
import { Repository } from 'typeorm';
import { UserChatroom } from './entities/user-chatroom.entity';

@Injectable()
export class ChatroomsService implements IChatroomsService {
  constructor(
    @Inject(CHATROOM_REPOSITORY)
    protected chatroomsRepository: Repository<Chatroom>,
  ) {}
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
