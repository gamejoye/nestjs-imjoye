import { Message } from 'src/modules/messages/entities/message.entity';
import { WebSocket } from 'ws';

export interface IWsGatewayService {
  handleOnPing(client: WebSocket, message: string): Promise<void>;
  notifynChat(from: number, message: Message): Promise<void>;
}
