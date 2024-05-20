import { ChatroomType } from 'src/common/constants/chatroom';

export class ChatroomVo {
  id: number;
  type: ChatroomType;
  name: string;
  avatarUrl: string;
  createTime: string;
}
