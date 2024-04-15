import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './interface/users.service.interface';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  USER_FRIENDSHIP_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { UserFriendship } from './entities/friendship.entity';
import { UserFriendshipType } from 'src/common/constants/friendship';
import { IFriendInfo } from './types/friend-info.type';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    protected usersRepository: Repository<User>,
    @Inject(USER_FRIENDSHIP_REPOSITORY)
    protected userFriendshipRepository: Repository<UserFriendship>,
  ) {}
  async getFriendInfoByUserIdAndFriendId(
    userId: number,
    friendId: number,
  ): Promise<IFriendInfo> {
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

    const friendInfo: IFriendInfo = {
      user: friendUser,
      status: friendship.status,
      createTime: friendship.createTime,
      updateTime: friendship.updateTime,
    };
    return friendInfo;
  }
  async getFriends(userId: number): Promise<User[]> {
    const friendshipsAsFrom = await this.userFriendshipRepository.find({
      where: { from: { id: userId }, status: UserFriendshipType.ACCEPT },
      relations: ['to'],
    });
    const friendshipsAsTo = await this.userFriendshipRepository.find({
      where: { to: { id: userId }, status: UserFriendshipType.ACCEPT },
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
      friend.passwordHash = '';
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
