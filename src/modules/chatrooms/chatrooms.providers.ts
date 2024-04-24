import {
  DATA_SOURCE,
  CHATROOM_REPOSITORY,
  USER_REPOSITORY,
  USER_CHATROOM_REPOSITORY,
} from 'src/common/constants/providers';
import { DataSource } from 'typeorm';
import { Chatroom } from './entities/chatroom.entity';
import { UserChatroom } from './entities/user-chatroom.entity';
import { User } from '../users/entities/user.entity';

export const chatroomsProviders = [
  {
    provide: CHATROOM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Chatroom),
    inject: [DATA_SOURCE],
  },
  {
    provide: USER_CHATROOM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserChatroom),
    inject: [DATA_SOURCE],
  },
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
