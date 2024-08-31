import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IMessagesService } from './interface/messages.service.interface';
import { Message } from './entities/message.entity';
import {
  CHATROOM_REPOSITORY,
  MESSAGE_REPOSITORY,
  USER_CHATROOM_REPOSITORY,
  USER_REPOSITORY,
} from 'src/common/constants/providers';
import { DeepPartial, Repository } from 'typeorm';
import { getCurrentDatetime } from 'src/common/utils/times';
import { User } from '../users/entities/user.entity';
import { Chatroom } from '../chatrooms/entities/chatroom.entity';
import { UserChatroom } from '../chatrooms/entities/user-chatroom.entity';
import { BasePaging } from 'src/common/types/base.dto';
import { GetMessagesDto } from './dto/get-messages-by-chatroom-id.dto';

@Injectable()
export class MessagesService implements IMessagesService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    protected messagesRepository: Repository<Message>,
    @Inject(USER_REPOSITORY)
    protected userRepository: Repository<User>,
    @Inject(CHATROOM_REPOSITORY)
    protected chatroomRepository: Repository<Chatroom>,
    @Inject(USER_CHATROOM_REPOSITORY)
    protected userChatroomRepository: Repository<UserChatroom>,
  ) { }
  async getByOldestPaging(
    chatroomId: number,
    paging: Pick<GetMessagesDto, 'oldest_message_id' | 'page_size'>,
  ): Promise<Array<Message>> {
    const { oldest_message_id, page_size } = paging;
    let queryBuilder = this.messagesRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.chatroom', 'chatroom')
      .innerJoinAndSelect('message.from', 'user')
      .where('message.chatroom.id = :chatroomId', { chatroomId })
      .orderBy('message.id', 'DESC')
      .limit(page_size);

    if (oldest_message_id) {
      queryBuilder = queryBuilder.andWhere('message.id < :oldestMessageId', {
        oldestMessageId: oldest_message_id,
      });
    }

    const messages = await queryBuilder.getMany();
    return messages;
  }
  countAll(chatroomId: number): Promise<number> {
    return this.messagesRepository.count({
      where: { chatroom: { id: chatroomId } },
    });
  }
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
    const userChatroom = await this.userChatroomRepository.findOne({
      where: {
        user: { id: from.id },
        chatroom: { id: chatroom.id },
      },
    });
    if (!userChatroom) {
      throw new HttpException('未知的用户id', HttpStatus.FORBIDDEN);
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
      .where('message.createTime >= :time', { time })
      .andWhere('message.chatroom.id = :chatroomId', { chatroomId })
      .getCount();
    return count;
  }
  async getLatestMessageByChatroomId(chatroomId: number): Promise<Message> {
    const query = this.messagesRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.chatroom', 'chatroom')
      .innerJoinAndSelect('message.from', 'user')
      .where('message.chatroom.id = :chatroomId', { chatroomId })
      .orderBy('message.createTime', 'DESC');
    return await query.getOne();
  }
  async getByPaging(
    chatroomId: number,
    paging: BasePaging,
  ): Promise<Message[]> {
    const { _start, _end, _order, _sort } = paging;
    const skip = _start;
    const amount = _end - _start;
    const query = this.messagesRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.chatroom', 'chatroom')
      .innerJoinAndSelect('message.from', 'user')
      .where('chatroom.id = :chatroomId', { chatroomId })
      .orderBy('message.createTime', 'DESC');
    query.orderBy(`message.${_sort}`, _order).skip(skip).take(amount);
    return await query.getMany();
  }
}
