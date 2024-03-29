import {
  DATA_SOURCE,
  CHATROOM_REPOSITORY,
} from 'src/common/constants/providers';
import { DataSource } from 'typeorm';
import { Chatroom } from './entities/chatroom.entity';

export const chatroomsProviders = [
  {
    provide: CHATROOM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Chatroom),
    inject: [DATA_SOURCE],
  },
];
