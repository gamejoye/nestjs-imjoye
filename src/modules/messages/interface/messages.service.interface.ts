import { DeepPartial } from 'typeorm';
import { Message } from '../entities/message.entity';

export interface IMessagesService {
  countByTime(chatroomId: number, time: string): Promise<number>;
  getLatestMessageByChatroomId(chatroomId: number): Promise<Message>;
  getByPaging(chatroomId: number): Promise<Array<Message>>;
  addMessage(partialMessage: DeepPartial<Message>): Promise<Message>;
}
