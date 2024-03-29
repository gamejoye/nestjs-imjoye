import { Inject, Injectable } from '@nestjs/common';
import { IMessagesService } from './interface/messages.service.interface';
import { Message } from './entities/message.entity';
import { MESSAGE_REPOSITORY } from 'src/common/constants/providers';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService implements IMessagesService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    protected messagesRepository: Repository<Message>,
  ) {}
  async countByTime(time: string): Promise<number> {
    const count = await this.messagesRepository
      .createQueryBuilder('message')
      .where('message.createTime > :time', { time })
      .getCount();
    return count;
  }
  async getLatestMessageByChatroomId(chatroomId: number): Promise<Message> {
    const query = this.messagesRepository
      .createQueryBuilder('message')
      .where('message.chatroom.id = :chatroomId', { chatroomId })
      .orderBy('message.createTime', 'DESC');
    return await query.getOne();
  }
  async getByPaging(): Promise<Message[]> {
    throw new Error('Method not implemented.');
  }
}
