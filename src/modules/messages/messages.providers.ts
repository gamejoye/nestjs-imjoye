import {
  CHATROOM_REPOSITORY,
  DATA_SOURCE,
  MESSAGE_REPOSITORY,
  USER_CHATROOM_REPOSITORY,
  USER_FRIENDSHIP_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { DataSource } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Chatroom } from '../chatrooms/entities/chatroom.entity';
import { UserChatroom } from '../chatrooms/entities/user-chatroom.entity';
import { UserFriendship } from '../users/entities/friendship.entity';

export const messagesProviders = [
  {
    provide: MESSAGE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
    inject: [DATA_SOURCE],
  },
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
  {
    provide: USER_CHATROOM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserChatroom),
    inject: [DATA_SOURCE],
  },
  {
    provide: USER_FRIENDSHIP_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserFriendship),
    inject: [DATA_SOURCE],
  },
];
