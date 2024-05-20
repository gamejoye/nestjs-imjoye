import { UserFriendshipType } from 'src/common/constants/friendship';
import { User } from '../entities/user.entity';

export interface FriendInfo {
  user: User;
  status: UserFriendshipType;
  createTime: string;
  updateTime: string;
}
