import { Chatroom } from '../entities/chatroom.entity';

export interface IChatroomsService {
  countAll(userId: number): Promise<number>;
  getAll(userId: number): Promise<Array<Chatroom>>;
  getByChatroomId(userId: number, chatroomId: number): Promise<Chatroom>;
  getByUserIdAndFriendId(userId: number, friendId: number): Promise<Chatroom>;
}
