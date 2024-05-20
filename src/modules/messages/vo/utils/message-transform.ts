import { Message } from '../../entities/message.entity';
import { MessageVo } from '../message.vo';

export function transformMessage(message: Message): MessageVo {
  const { chatroom, from } = message;
  return {
    id: message.id,
    temporaryId: message.temporaryId,
    chatroom: {
      id: chatroom.id,
      type: chatroom.type,
      name: chatroom.name,
      avatarUrl: chatroom.avatarUrl,
      createTime: chatroom.createTime,
    },
    from: {
      id: from.id,
      username: from.username,
      email: from.email,
      avatarUrl: from.avatarUrl,
      description: from.description,
      createTime: from.createTime,
    },
    content: message.content,
    createTime: message.createTime,
  };
}
