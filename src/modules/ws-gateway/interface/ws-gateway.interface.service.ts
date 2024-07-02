import { Message } from 'src/modules/messages/entities/message.entity';
import { FriendRequest } from 'src/modules/users/entities/friendrequest.entity';
import { User } from 'src/modules/users/entities/user.entity';
// import { WebSocket } from 'ws';

export interface IWsGatewayService {
  // handleOnPing(client: WebSocket, message: string): Promise<void>;
  notifynChat(from: number, message: Message): Promise<void>;
  notifyNewFriendRequest(to: number, fq: FriendRequest): Promise<void>;
  notifyNewFriend(to: number, friend: User): Promise<void>;
}
