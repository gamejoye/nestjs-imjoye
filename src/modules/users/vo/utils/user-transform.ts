import { User } from '../../entities/user.entity';
import { FriendInfo } from '../../types/friend-info.type';
import { FriendInfoVo } from '../friend-info.vo';
import { UserVo } from '../user.vo';

export function transformUser(user: User): UserVo {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    description: user.description,
    createTime: user.createTime,
  };
}

export function transformFriendInfo(friendInfo: FriendInfo): FriendInfoVo {
  return {
    user: transformUser(friendInfo.user),
    ...friendInfo,
  };
}
