import {
  CHATROOM_REPOSITORY,
  DATA_SOURCE,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Chatroom } from '../chatrooms/entities/chatroom.entity';

export const wsGatewayProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
  {
    provide: CHATROOM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Chatroom),
    inject: [DATA_SOURCE],
  },
];
