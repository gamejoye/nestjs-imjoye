import { UserFriendshipType } from 'src/common/constants/friendship';
import { UserVo } from './user.vo';

export class FriendInfoVo {
  user: UserVo;
  status: UserFriendshipType;
  createTime: string;
  updateTime: string;
}
