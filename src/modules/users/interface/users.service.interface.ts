import { User } from '../entities/user.entity';
import { IFriendInfo } from '../types/friend-info.type';

export interface IUsersService {
  getByEmail(email: string): Promise<User | null>;
  getById(id: number): Promise<User | null>;
  register(
    username: string,
    email: string,
    passwordHash: string,
    avatarUrl: string,
  ): Promise<User>;
  getFriends(userId: number): Promise<Array<User>>;
  getFriendInfoByUserIdAndFriendId(
    userId: number,
    friendId: number,
  ): Promise<IFriendInfo>;
}
