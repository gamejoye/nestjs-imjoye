import { DATA_SOURCE, USER_REPOSITORY } from 'src/common/constants/providers';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
