import {
  DATA_SOURCE,
  MESSAGE_REPOSITORY,
} from 'src/common/constants/providers';
import { DataSource } from 'typeorm';
import { Message } from './entities/message.entity';

export const messagesProviders = [
  {
    provide: MESSAGE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
    inject: [DATA_SOURCE],
  },
];
