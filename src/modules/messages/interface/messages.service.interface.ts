import { Message } from '../entities/message.entity';

export interface IMessagesService {
  countByTime(time: string): Promise<number>;
  getLatestMessageByChatroomId(chatroomId: number): Promise<Message>;
  getByPaging(): Promise<Array<Message>>;
}
