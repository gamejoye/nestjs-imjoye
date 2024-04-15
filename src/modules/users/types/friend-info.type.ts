import { UserFriendshipType } from 'src/common/constants/friendship';
import { User } from '../entities/user.entity';

export interface IFriendInfo {
  user: User;
  status: UserFriendshipType;
  createTime: string;
  updateTime: string;
}
