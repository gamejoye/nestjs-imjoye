import {
  DATA_SOURCE,
  USER_FRIENDSHIP_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { UserFriendship } from './entities/friendship.entity';

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
];
