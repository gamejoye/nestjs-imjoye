import { Chatroom } from '../../entities/chatroom.entity';
import { ChatroomVo } from '../chatroom.vo';

export function transformChatroom(chatroom: Chatroom): ChatroomVo {
  return {
    id: chatroom.id,
    type: chatroom.type,
    name: chatroom.name,
    avatarUrl: chatroom.avatarUrl,
    createTime: chatroom.createTime,
  };
}
