import { DeepPartial } from 'typeorm';
import { Message } from '../entities/message.entity';
import { BasePaging } from 'src/common/types/base.dto';

export interface IMessagesService {
  countByTime(chatroomId: number, time: string): Promise<number>;
  countAll(chatroomId: number): Promise<number>;
  getLatestMessageByChatroomId(chatroomId: number): Promise<Message>;
  getByPaging(chatroomId: number, paging: BasePaging): Promise<Array<Message>>;
  addMessage(partialMessage: DeepPartial<Message>): Promise<Message>;
}
