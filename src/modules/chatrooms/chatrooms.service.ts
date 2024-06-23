import { Inject, Injectable } from '@nestjs/common';
import { IChatroomsService } from './interface/chatrooms.service.interface';
import { Chatroom } from './entities/chatroom.entity';
import {
  CHATROOM_REPOSITORY,
  USER_CHATROOM_REPOSITORY,
  USER_FRIENDSHIP_REPOSITORY,
} from 'src/common/constants/providers';
import { Repository } from 'typeorm';
import { ChatroomType } from 'src/common/constants/chatroom';
import { Logger } from 'src/common/utils';
import { USER_CHATROOM } from 'src/common/constants/database-tables';
import { UserChatroom } from './entities/user-chatroom.entity';
import { UserFriendship } from '../users/entities/friendship.entity';
import { UserFriendshipType } from 'src/common/constants/friendship';

@Injectable()
export class ChatroomsService implements IChatroomsService {
  constructor(
    @Inject(CHATROOM_REPOSITORY)
    protected chatroomsRepository: Repository<Chatroom>,
    @Inject(USER_CHATROOM_REPOSITORY)
    protected userChatroomRepository: Repository<UserChatroom>,
    @Inject(USER_FRIENDSHIP_REPOSITORY)
    protected userFriendshipRepository: Repository<UserFriendship>,
  ) { }
  async getByUserIdAndFriendId(
    userId: number,
    friendId: number,
  ): Promise<Chatroom> {
    let ufs = await this.userFriendshipRepository.findOne({
      where: {
        from: { id: userId },
        to: { id: friendId },
        status: UserFriendshipType.ACCEPT,
      },
      relations: ['chatroom', 'from', 'to'],
    });
    if (!ufs) {
      ufs = await this.userFriendshipRepository.findOne({
        where: {
          from: { id: friendId },
          to: { id: userId },
          status: UserFriendshipType.ACCEPT,
        },
        relations: ['chatroom', 'from', 'to'],
      });
    }
    if (ufs) {
      const chatroom = ufs.chatroom;
      if (chatroom) {
        const friend = ufs.from.id === userId ? ufs.to : ufs.from;
        chatroom.userChatrooms = undefined;
        chatroom.avatarUrl = friend.avatarUrl;
        chatroom.name = friend.username;
      }
      return chatroom;
    }
    return null;
    // const chatroom = await this.chatroomsRepository
    //   .createQueryBuilder('chatroom')
    //   .innerJoinAndSelect('chatroom.userChatrooms', 'userChatroom')
    //   .innerJoinAndSelect('userChatroom.user', 'user')
    //   .where('chatroom.type = :type', { type: ChatroomType.SINGLE })
    //   .andWhere(
    //     new Brackets((qb) => {
    //       qb.where('userChatroom.user.id = :friendId', { friendId }).andWhere(
    //         `chatroom.id IN (SELECT chatroom_id FROM ${USER_CHATROOM} WHERE user_id = :userId)`,
    //         { userId },
    //       );
    //     }),
    //   )
    //   .getOne();
    // if (chatroom) {
    //   const userChatroom = chatroom.userChatrooms[0];
    //   chatroom.userChatrooms = undefined;
    //   chatroom.avatarUrl = userChatroom.user.avatarUrl;
    //   chatroom.name = userChatroom.user.username;
    // }
    // return chatroom;
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
    if (
      !chatroom ||
      !chatroom.userChatrooms.some(({ user }) => user.id === userId)
    ) {
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
    const all = this.userChatroomRepository.count({
      where: { user: { id: userId } },
    });
    return all;
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
