import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IMessagesService } from './interface/messages.service.interface';
import { Message } from './entities/message.entity';
import {
  CHATROOM_REPOSITORY,
  MESSAGE_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { DeepPartial, Repository } from 'typeorm';
import { getCurrentDatetime } from 'src/common/utils/times';
import { User } from '../users/entities/user.entity';
import { Chatroom } from '../chatrooms/entities/chatroom.entity';

@Injectable()
export class MessagesService implements IMessagesService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    protected messagesRepository: Repository<Message>,
    @Inject(USER_REPOSITORY)
    protected userRepository: Repository<User>,
    @Inject(CHATROOM_REPOSITORY)
    protected chatroomRepository: Repository<Chatroom>,
  ) {}
  async addMessage(partialMessage: DeepPartial<Message>): Promise<Message> {
    const chatroom = await this.chatroomRepository.findOne({
      where: {
        id: partialMessage.chatroom.id,
      },
    });
    if (!chatroom) {
      throw new HttpException('未知的聊天室id', HttpStatus.NOT_FOUND);
    }
    const from = await this.userRepository.findOne({
      where: {
        id: partialMessage.from.id,
      },
    });
    if (!from) {
      throw new HttpException('未知的用户id', HttpStatus.NOT_FOUND);
    }
    const messageToBeAdd: DeepPartial<Message> = {
      ...partialMessage,
      createTime: getCurrentDatetime(),
    };
    const message = await this.messagesRepository.save(messageToBeAdd);
    message.chatroom = chatroom;
    message.from = from;
    return message;
  }
  async countByTime(chatroomId: number, time: string): Promise<number> {
    const count = await this.messagesRepository
      .createQueryBuilder('message')
      .where('message.createTime > :time', { time })
      .andWhere('message.chatroom.id = :chatroomId', { chatroomId })
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
  async getByPaging(chatroomId: number): Promise<Message[]> {
    const query = this.messagesRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.chatroom', 'chatroom')
      .innerJoinAndSelect('message.from', 'user')
      .where('chatroom.id = :chatroomId', { chatroomId })
      .orderBy('message.createTime', 'DESC');
    return await query.getMany();
  }
}
