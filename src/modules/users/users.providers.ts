import {
  DATA_SOURCE,
  FRIEND_REQUEST_REPOSITORY,
  USER_FRIENDSHIP_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { UserFriendship } from './entities/friendship.entity';
import { FriendRequest } from './entities/friendrequest.entity';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
  {
    provide: USER_FRIENDSHIP_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserFriendship),
    inject: [DATA_SOURCE],
  },
  {
    provide: FRIEND_REQUEST_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(FriendRequest),
    inject: [DATA_SOURCE],
  },
];
