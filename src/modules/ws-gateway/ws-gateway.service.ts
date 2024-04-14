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

@Injectable()
export class WsGatewayService implements OnModuleInit, OnModuleDestroy {
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
      console.log(`Client[${userId}] 建立连接`);

      ws.on('message', (rawData) => {
        const message: IWebSocketMessage<unknown> = JSON.parse(
          rawData.toString('utf-8'),
        );
        console.log('message: ', message);
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
        console.log(`Client[${offlineUserId}] 断开连接`);
      });
    });
  }

  onModuleDestroy() {
    this.wss.close(() => {
      console.log('WebSocket 服务关闭');
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
