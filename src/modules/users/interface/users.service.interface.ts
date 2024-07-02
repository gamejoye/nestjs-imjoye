import { FriendRequestType } from 'src/common/constants/friendrequest';
import { FriendRequest } from '../entities/friendrequest.entity';
import { User } from '../entities/user.entity';
import { FriendInfo } from '../types/friend-info.type';

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
  getFriendRqeusts(userId: number): Promise<Array<FriendRequest>>;
  updateFriendRequestStatus(
    id: number,
    status: FriendRequestType,
  ): Promise<FriendRequest>;
  createFriendRequest(from: number, to: number): Promise<FriendRequest>;
  getFriendInfoByUserIdAndFriendId(
    userId: number,
    friendId: number,
  ): Promise<FriendInfo>;
}
