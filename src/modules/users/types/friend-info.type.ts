import { User } from '../entities/user.entity';

export interface FriendInfo {
  user: User;
  createTime: string;
}
