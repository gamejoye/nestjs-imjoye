import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './interface/users.service.interface';
import { User } from './entities/user.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import {
  DATA_SOURCE,
  FRIEND_REQUEST_REPOSITORY,
  USER_FRIENDSHIP_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { UserFriendship } from './entities/friendship.entity';
import { FriendInfo } from './types/friend-info.type';
import { FriendRequest } from './entities/friendrequest.entity';
import { FriendRequestType } from 'src/common/constants/friendrequest';
import { Chatroom } from '../chatrooms/entities/chatroom.entity';
import { ChatroomType } from 'src/common/constants/chatroom';
import { getCurrentDatetime, Logger } from 'src/common/utils';
import { UserChatroom } from '../chatrooms/entities/user-chatroom.entity';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    protected usersRepository: Repository<User>,
    @Inject(USER_FRIENDSHIP_REPOSITORY)
    protected userFriendshipRepository: Repository<UserFriendship>,
    @Inject(FRIEND_REQUEST_REPOSITORY)
    protected friendRequestRepository: Repository<FriendRequest>,
    @Inject(DATA_SOURCE) protected dataSouce: DataSource,
  ) { }
  getFriendRequestById(id: number): Promise<FriendRequest> {
    return this.friendRequestRepository.findOne({
      where: { id },
      relations: ['from', 'to'],
    });
  }
  async createFriendRequest(from: number, to: number): Promise<FriendRequest> {
    let userFS = await this.userFriendshipRepository.findOne({
      where: { from: { id: from }, to: { id: to } },
    });
    if (!userFS) {
      userFS = await this.userFriendshipRepository.findOne({
        where: { to: { id: from }, from: { id: to } },
      });
    }
    if (userFS) {
      // 已经是好友了
      return null;
    }

    const existing = await this.friendRequestRepository.findOne({
      where: {
        from: { id: from },
        to: { id: to },
      },
      relations: ['from', 'to'],
      order: { createTime: 'DESC' },
    });
    const existingAdverse = await this.friendRequestRepository.findOne({
      where: {
        from: { id: to },
        to: { id: from },
      },
      relations: ['from', 'to'],
      order: { createTime: 'DESC' },
    });
    const partial: DeepPartial<FriendRequest> = {
      from: { id: from },
      to: { id: to },
      status: FriendRequestType.PENDING,
    };
    if (!existing && !existingAdverse) {
      // 两者之间从来没有发送过好友请求
      const saved = await this.friendRequestRepository.save(partial);
      return this.friendRequestRepository.findOne({
        where: { id: saved.id },
        relations: ['from', 'to'],
      });
    }

    // 只考虑最后一次的请求
    let lastestFriendRequest: FriendRequest;
    if (!existing) lastestFriendRequest = existingAdverse;
    else if (!existingAdverse) lastestFriendRequest = existing;
    else {
      const t1 = new Date(existing.createTime).getTime();
      const t2 = new Date(existingAdverse.createTime).getTime();
      if ((t1 === t2 && existing.id > existingAdverse.id) || t1 >= t2) {
        lastestFriendRequest = existing;
      } else {
        lastestFriendRequest = existingAdverse;
      }
    }

    if (lastestFriendRequest.status === FriendRequestType.PENDING) {
      // 重复发送
      if (lastestFriendRequest.from.id === from) return null;

      // 对方之前发送过 直接同意
      return this.dataSouce.transaction(async (manager) => {
        const createTime = getCurrentDatetime();
        const accept: FriendRequest = {
          ...lastestFriendRequest,
          status: FriendRequestType.ACCEPT,
          updateTime: createTime,
        };
        // 更新好友请求
        const savedFriendRequest = await manager.save(FriendRequest, accept);
        const partialSingleChatroom: DeepPartial<Chatroom> = {
          type: ChatroomType.SINGLE,
          createTime,
        };
        // 插入单聊
        const savedChatroom = await manager.save(
          Chatroom,
          partialSingleChatroom,
        );
        const partialUserChatroom1: DeepPartial<UserChatroom> = {
          user: { id: accept.to.id },
          chatroom: { id: savedChatroom.id },
          createTime,
          latestVisitTime: createTime,
        };
        const partialUserChatroom2: DeepPartial<UserChatroom> = {
          user: { id: accept.from.id },
          chatroom: { id: savedChatroom.id },
          createTime,
          latestVisitTime: createTime,
        };
        // 插入用户和单聊的关系
        await manager.save(UserChatroom, partialUserChatroom1);
        await manager.save(UserChatroom, partialUserChatroom2);
        const partialUserFs: DeepPartial<UserFriendship> = {
          from: { id: accept.from.id },
          to: { id: accept.to.id },
          chatroom: { id: savedChatroom.id },
          createTime,
        };
        // 插入好友关系
        await manager.save(UserFriendship, partialUserFs);
        const [from, to] = await Promise.all([
          this.usersRepository.findOne({ where: { id: accept.from.id } }),
          this.usersRepository.findOne({ where: { id: accept.to.id } }),
        ]);
        return {
          ...savedFriendRequest,
          from,
          to,
        };
      });
    }

    const saved = await this.friendRequestRepository.save(partial);
    return this.friendRequestRepository.findOne({
      where: { id: saved.id },
      relations: ['from', 'to'],
    });
  }

  async updateFriendRequestStatus(
    id: number,
    status: FriendRequestType,
  ): Promise<FriendRequest> {
    const existing = await this.friendRequestRepository.findOne({
      where: { id },
    });
    if (existing) {
      const completed = await this.friendRequestRepository.save({
        ...existing,
        status,
      });
      return completed;
    }
    return null;
  }
  async getFriendRqeusts(userId: number): Promise<Array<FriendRequest>> {
    const fqs = await this.friendRequestRepository
      .createQueryBuilder('fq')
      .leftJoinAndSelect('fq.from', 'fu')
      .leftJoinAndSelect('fq.to', 'tu')
      .where('fu.id = :userId', { userId })
      .orWhere('tu.id = :userId', { userId })
      .orderBy('fq.createTime', 'DESC')
      .getMany();
    return fqs;
  }
  async getFriendInfoByUserIdAndFriendId(
    userId: number,
    friendId: number,
  ): Promise<FriendInfo> {
    const friendship = await this.userFriendshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.from', 'fromUser')
      .leftJoinAndSelect('friendship.to', 'toUser')
      .where(
        '(friendship.from.id = :userId AND friendship.to.id = :friendId) OR (friendship.from.id = :friendId AND friendship.to.id = :userId)',
        { userId, friendId },
      )
      .getOne();

    if (!friendship) {
      throw new HttpException('Friendship not found.', HttpStatus.NOT_FOUND);
    }

    const friendUser =
      friendship.from.id === userId ? friendship.to : friendship.from;

    const friendInfo: FriendInfo = {
      user: friendUser,
      createTime: friendship.createTime,
    };
    return friendInfo;
  }
  async getFriends(userId: number): Promise<User[]> {
    const friendshipsAsFrom = await this.userFriendshipRepository.find({
      where: { from: { id: userId } },
      relations: ['to'],
    });
    const friendshipsAsTo = await this.userFriendshipRepository.find({
      where: { to: { id: userId } },
      relations: ['from'],
    });

    const friendsAsFrom = friendshipsAsFrom.map((friendship) => friendship.to);
    const friendsAsTo = friendshipsAsTo.map((friendship) => friendship.from);
    const friendsWithoutDuplication = new Map<number, User>();
    friendsAsFrom.forEach((friend) =>
      friendsWithoutDuplication.set(friend.id, friend),
    );
    friendsAsTo.forEach((friend) =>
      friendsWithoutDuplication.set(friend.id, friend),
    );
    return Array.from(friendsWithoutDuplication).map(([, friend]) => {
      return friend;
    });
  }
  async getById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }
  async register(
    username: string,
    email: string,
    passwordHash: string,
    avatarUrl: string,
  ): Promise<User> {
    const partial = this.usersRepository.create({
      username,
      email,
      passwordHash,
      avatarUrl,
    });
    const user = await this.usersRepository.save(partial);
    return user;
  }
  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }
}
