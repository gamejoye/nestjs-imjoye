import { Chatroom } from '../entities/chatroom.entity';

export interface IChatroomsService {
  countAll(userId: number): Promise<number>;
  getAll(userId: number): Promise<Array<Chatroom>>;
  // getLatestMessage(userId: number, roomId: number): Promise<Message>;
  // getLatestMessages(userId: number, roomIds: Array<number>): Promise<Array<Message>>;
}
