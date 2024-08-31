import { DeepPartial } from 'typeorm';
import { Message } from '../entities/message.entity';
import { BasePaging } from 'src/common/types/base.dto';
import { GetMessagesDto } from '../dto/get-messages-by-chatroom-id.dto';

export interface IMessagesService {
  countByTime(chatroomId: number, time: string): Promise<number>;
  countAll(chatroomId: number): Promise<number>;
  getLatestMessageByChatroomId(chatroomId: number): Promise<Message>;
  getByPaging(chatroomId: number, paging: BasePaging): Promise<Array<Message>>;
  getByOldestPaging(
    chatroomId: number,
    paging: Pick<GetMessagesDto, 'oldest_message_id' | 'page_size'>,
  ): Promise<Array<Message>>;
  addMessage(partialMessage: DeepPartial<Message>): Promise<Message>;
}
