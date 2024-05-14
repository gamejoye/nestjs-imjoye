import { Inject, Injectable } from '@nestjs/common';
import { USER_CHATROOM_REPOSITORY } from 'src/common/constants/providers';
import { Repository } from 'typeorm';
import { IUserChatroomService } from './interface/user-chatrooms.service.interface';
import { UserChatroom } from './entities/user-chatroom.entity';

@Injectable()
export class UserChatroomService implements IUserChatroomService {
  constructor(
    @Inject(USER_CHATROOM_REPOSITORY)
    protected userChatroomRepository: Repository<UserChatroom>,
  ) {}
  async updateLatestVisitTime(
    userId: number,
    chatroomId: number,
    timestamp: string,
  ): Promise<UserChatroom> {
    let userChatroom = await this.userChatroomRepository.findOne({
      where: {
        user: { id: userId },
        chatroom: { id: chatroomId },
      },
    });
    if (userChatroom) {
      userChatroom = await this.userChatroomRepository.save({
        ...userChatroom,
        latestVisitTime: timestamp,
      });
    }
    return userChatroom;
  }
  async getByUserIdAndChatroomId(
    userId: number,
    chatroomId: number,
  ): Promise<UserChatroom> {
    const userChatroom = await this.userChatroomRepository.findOne({
      where: {
        user: { id: userId },
        chatroom: { id: chatroomId },
      },
    });
    return userChatroom;
  }
}
