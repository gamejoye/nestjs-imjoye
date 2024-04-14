import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from './interface/users.service.interface';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  USER_FRIENDSHIP_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { UserFriendship } from './entities/friendship.entity';
import { UserFriendshipType } from 'src/common/constants/friendship';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    protected usersRepository: Repository<User>,
    @Inject(USER_FRIENDSHIP_REPOSITORY)
    protected userFriendshipRepository: Repository<UserFriendship>,
  ) {}
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
