import { UserChatroom } from '../entities/user-chatroom.entity';

export interface IUserChatroomService {
  getByUserIdAndChatroomId(
    userId: number,
    chatroomId: number,
  ): Promise<UserChatroom>;
  updateLatestVisitTime(
    userId: number,
    chatroomId: number,
    timestamp: string,
  ): Promise<UserChatroom>;
}
