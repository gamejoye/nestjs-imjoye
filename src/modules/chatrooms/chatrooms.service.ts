import { Inject, Injectable } from '@nestjs/common';
import { IChatroomsService } from './interface/chatrooms.service.interface';
import { Chatroom } from './entities/chatroom.entity';
import { CHATROOM_REPOSITORY } from 'src/common/constants/providers';
import { Brackets, Repository } from 'typeorm';
import { ChatroomType } from 'src/common/constants/chatroom';
import { Logger } from 'src/common/utils';
import { USER_CHATROOM } from 'src/common/constants/database-tables';

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
      .innerJoinAndSelect('userChatroom.user', 'user')
      .where('chatroom.type = :type', { type: ChatroomType.SINGLE })
      .andWhere(
        new Brackets((qb) => {
          qb.where('userChatroom.user.id = :friendId', { friendId }).andWhere(
            `chatroom.id IN (SELECT chatroom_id FROM ${USER_CHATROOM} WHERE user_id = :userId)`,
            { userId },
          );
        }),
      )
      .getOne();
    if (chatroom) {
      const userChatroom = chatroom.userChatrooms[0];
      chatroom.userChatrooms = undefined;
      chatroom.avatarUrl = userChatroom.user.avatarUrl;
      chatroom.name = userChatroom.user.username;
    }
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
      .innerJoinAndSelect('userChatroom.user', 'user')
      .where('chatroom.id = :chatroomId', { chatroomId });
    const chatroom = await query.getOne();
    if (!chatroom.userChatrooms.some(({ user }) => user.id === userId)) {
      return null;
    }
    Logger.log(userId, chatroomId, chatroom.userChatrooms);
    if (chatroom && chatroom.type === ChatroomType.SINGLE) {
      const friend = chatroom.userChatrooms
        .map((userChatroom) => userChatroom.user)
        .find((user) => user.id !== userId);
      chatroom.avatarUrl = friend.avatarUrl;
      chatroom.name = friend.username;
    }
    chatroom.userChatrooms = undefined;
    return chatroom;
  }
  async countAll(userId: number): Promise<number> {
    return userId;
  }
  async getAll(userId: number): Promise<Array<Chatroom>> {
    const query = this.chatroomsRepository
      .createQueryBuilder('chatroom')
      .innerJoinAndSelect(
        'chatroom.userChatrooms',
        'userChatroom',
        'userChatroom.chatroom.id = chatroom.id',
      )
      .innerJoinAndSelect('userChatroom.user', 'user')
      .where(
        `chatroom.id IN (SELECT chatroom_id FROM ${USER_CHATROOM} WHERE user_id = :userId)`,
        { userId },
      );
    const chatrooms = await query.getMany();
    chatrooms.forEach((chatroom) => {
      if (chatroom.type === ChatroomType.SINGLE) {
        const friend = chatroom.userChatrooms
          .map((userChatroom) => userChatroom.user)
          .find((user) => user.id !== userId);
        chatroom.avatarUrl = friend.avatarUrl;
        chatroom.name = friend.username;
      }
      chatroom.userChatrooms = undefined;
    });
    return chatrooms;
  }
}
