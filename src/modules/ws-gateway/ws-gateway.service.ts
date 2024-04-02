import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { WebSocketEvent } from 'src/common/constants/websocketEvents';
import { IWebSocketMessage } from 'src/common/types/base.type';
import { Server, WebSocket } from 'ws';
import { Message } from '../messages/entities/message.entity';
import { USER_REPOSITORY } from 'src/common/constants/providers';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WsGatewayService implements OnModuleInit, OnModuleDestroy {
  private wss: Server;
  private onlineClients: Map<number, WebSocket>;
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepository: Repository<User>,
  ) {}

  onModuleInit() {
    this.onlineClients = new Map();
    this.wss = new Server({ port: 5173 });
    this.wss.on('connection', (ws, req) => {
      /**
       * TODO 身份验证 req.headers.authentication
       */
      console.log('用户连接过来了: ', req.headers);
      this.onlineClients.set(1, ws);
      ws.on('message', (rawData) => {
        const message: IWebSocketMessage<unknown> = JSON.parse(
          rawData.toString('utf-8'),
        );
        console.log('message: ', message);
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }

  onModuleDestroy() {
    this.wss.close(() => {
      console.log('WebSocket server closed');
    });
  }

  async notifynChat(from: number, message: Message) {
    /**
     * TODO 为了消息的可靠性
     * 在应用层提供向TCP协议一样的 syn/ack机制
     * 确保每条消息都 成功发送 & 成功接收
     */
    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.userChatrooms', 'userChatroom')
      .innerJoin('userChatroom.chatroom', 'chatroom')
      .where('chatroom.id = :chatroomId', { chatroomId: message.chatroom.id })
      .getMany();
    const currentOnlineClients: Array<[WebSocket, User]> = users
      .filter((user) => this.onlineClients.has(user.id))
      .map((user) => [this.onlineClients.get(user.id), user]);
    currentOnlineClients.forEach(([client, user]) => {
      const socketMessage: IWebSocketMessage<Message> = {
        event: WebSocketEvent.NEW_MESSAGE,
        payload: message,
      };
      client.send(JSON.stringify(socketMessage));
      console.log('成功向userId[' + user.id + ']的用户发送了[NEW_MESSAGE]事件');
    });
  }
}
