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
import { AUTHORIZATION } from 'src/common/constants/websocketHeaders';
import * as jwt from 'jsonwebtoken';
import { EnvConfigService } from '../env-config/env-config.service';
import { Logger, websocketRetry } from 'src/common/utils';
import { IWsGatewayService } from './interface/ws-gateway.interface.service';

@Injectable()
export class WsGatewayService
  implements OnModuleInit, OnModuleDestroy, IWsGatewayService {
  private wss: Server;
  private onlineClients: Map<number, WebSocket>;
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepository: Repository<User>,
    protected readonly envConfigService: EnvConfigService,
  ) {}

  onModuleInit() {
    this.onlineClients = new Map();
    this.wss = new Server({ port: 5173 });
    this.wss.on('connection', (ws, req) => {
      const token = req.headers[AUTHORIZATION];
      const payload = jwt.verify(
        token,
        this.envConfigService.getJwtConfig().secret,
      );
      if (
        !payload ||
        typeof payload === 'string' ||
        typeof payload.id !== 'number'
      )
        return;
      const userId = payload.id;
      this.onlineClients.set(userId, ws);
      Logger.log(`Client[${userId}] 建立连接`);

      ws.on('message', (rawData) => {
        const wsMessage: IWebSocketMessage<unknown> = JSON.parse(
          rawData.toString('utf-8'),
        );
        switch (wsMessage.event) {
          case WebSocketEvent.PING: {
            const message = wsMessage.payload as string;
            this.handleOnPing(ws, message);
            break;
          }
        }
      });

      ws.on('close', () => {
        let offlineUserId = -1;
        for (const [userId, currentWs] of this.onlineClients.entries()) {
          if (currentWs === ws) {
            offlineUserId = userId;
            break;
          }
        }
        if (offlineUserId !== -1) {
          this.onlineClients.delete(offlineUserId);
        }
        Logger.log(`Client[${offlineUserId}] 断开连接`);
      });
    });
  }

  onModuleDestroy() {
    if (this.wss) this.wss.close(() => {});
  }

  async handleOnPing(client: WebSocket, message: string) {
    const pong: IWebSocketMessage<string> = {
      event: WebSocketEvent.PONG,
      payload: 'pong',
    };
    Logger.log(message, pong);
    client.send(JSON.stringify(pong));
  }

  async notifynChat(from: number, message: Message) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.userChatrooms', 'userChatroom')
      .innerJoin('userChatroom.chatroom', 'chatroom')
      .where('chatroom.id = :chatroomId', { chatroomId: message.chatroom.id })
      .getMany();
    const currentOnlineClients: Array<[WebSocket, User]> = users
      .filter((user) => user.id !== from && this.onlineClients.has(user.id))
      .map((user) => [this.onlineClients.get(user.id), user]);

    /**
     * 在应用层提供向TCP协议一样的 syn/ack机制
     * 确保每条消息都 成功发送 & 成功接收
     */
    const senderClient = this.onlineClients.get(from);
    if (senderClient) {
      /**
       * 通知消息发送者已经成功接收到发送的消息了
       * TODO auto retry
       */
      const senderSocketMessage: IWebSocketMessage<Message> = {
        event: WebSocketEvent.MESSAGE_ACK,
        payload: message,
      };
      const retryMessageAck = () => {
        Logger.log(
          `成功向在聊天室[${message.chatroom.id}]的发送者[${from}]发送MESSAGE_ACK事件`,
        );
        senderClient.send(JSON.stringify(senderSocketMessage));
      };
      const successCondition = (result: IWebSocketMessage<Message>) => {
        return (
          result.event === WebSocketEvent.MESSAGE_ACK_SYN &&
          result.payload.id === message.id
        );
      };
      websocketRetry<Message>(senderClient, retryMessageAck, successCondition);
    }

    currentOnlineClients.forEach(([receiverClient, user]) => {
      /**
       * 通知在聊天室中的所有用户需要接收新的消息
       */
      const socketMessage: IWebSocketMessage<Message> = {
        event: WebSocketEvent.MESSAGE_NOTIFY_SYN,
        payload: message,
      };
      const retryNotifyMessage = () => {
        Logger.log(
          `成功向在聊天室[${message.chatroom.id}]用户[${user.id}]发送[NOTIFY_MESSAGE_SYN]事件`,
        );
        receiverClient.send(JSON.stringify(socketMessage));
      };
      const successCondition = (result: IWebSocketMessage<Message>) => {
        return (
          result.event === WebSocketEvent.MESSAGE_NOTIFY_ACK &&
          result.payload.id === message.id
        );
      };
      websocketRetry<Message>(
        receiverClient,
        retryNotifyMessage,
        successCondition,
      );
    });
  }
}
