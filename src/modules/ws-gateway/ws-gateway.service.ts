import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { WebSocketEventType } from 'src/common/constants/websocketEvents';
import { IWebSocketMessage } from 'src/common/types/base.type';
import { Server, WebSocket } from 'ws';
import { Message } from '../messages/entities/message.entity';
import { USER_REPOSITORY } from 'src/common/constants/providers';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AUTHORIZATION } from 'src/common/constants/websocketHeaders';
import * as jwt from 'jsonwebtoken';
import { EnvConfigService } from '../env-config/env-config.service';
import { Logger } from 'src/common/utils';
import { IWsGatewayService } from './interface/ws-gateway.interface.service';
import { FriendRequest } from '../users/entities/friendrequest.entity';

@Injectable()
export class WsGatewayService
  implements OnModuleInit, OnModuleDestroy, IWsGatewayService {
  private wss: Server;
  private onlineClients: Map<number, WebSocket>;
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepository: Repository<User>,
    protected readonly envConfigService: EnvConfigService,
  ) { }

  onModuleInit() {
    this.onlineClients = new Map();
    this.wss = new Server({ port: 5173 });
    this.wss.on('connection', (ws, req) => {
      let token = req.headers[AUTHORIZATION];
      if (!token) {
        const searchParams = req.url.substring(
          Math.max(req.url.indexOf(AUTHORIZATION), 0),
        );
        const params = new URLSearchParams(searchParams);
        token = params.get(AUTHORIZATION);
      }
      if (!token) {
        ws.close();
        return;
      }
      let payload: jwt.JwtPayload;
      try {
        payload = jwt.verify(
          token,
          this.envConfigService.getJwtConfig().secret,
        ) as jwt.JwtPayload;
        if (
          !payload ||
          typeof payload === 'string' ||
          typeof payload.id !== 'number'
        ) {
          throw new Error('invalid token');
        }
      } catch (e) {
        ws.close();
        return;
      }
      const userId = payload.id;
      this.onlineClients.set(userId, ws);
      Logger.log(`Client[${userId}] 建立连接`);

      // ws.on('message', (rawData) => {
      //   const wsMessage: IWebSocketMessage<unknown> = JSON.parse(
      //     rawData.toString('utf-8'),
      //   );
      //   switch (wsMessage.event) {
      //     case WebSocketEvent.PING: {
      //       const message = wsMessage.payload as string;
      //       this.handleOnPing(ws, message);
      //       break;
      //     }
      //   }
      // });

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
    if (this.wss) this.wss.close(() => { });
  }

  async notifyNewFriend(to: number, friend: User): Promise<void> {
    const onlineClient = this.onlineClients.get(to);
    if (onlineClient) {
      const socketMessage: IWebSocketMessage<User> = {
        event: WebSocketEventType.NEW_FRIEND,
        payload: friend,
      };
      onlineClient.send(JSON.stringify(socketMessage));
    }
  }

  async notifyNewFriendRequest(to: number, fq: FriendRequest) {
    const onlineClient = this.onlineClients.get(to);
    if (onlineClient) {
      const socketMessage: IWebSocketMessage<FriendRequest> = {
        event: WebSocketEventType.NEW_FRIEND_REQUEST,
        payload: fq,
      };
      onlineClient.send(JSON.stringify(socketMessage));
    }
  }

  async notifynChat(from: number, message: Message) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.userChatrooms', 'userChatroom')
      .innerJoin('userChatroom.chatroom', 'chatroom')
      .where('chatroom.id = :chatroomId', { chatroomId: message.chatroom.id })
      .getMany();
    const currentOnlineClients: Array<[WebSocket, User]> = users
      .filter((user) => this.onlineClients.has(user.id))
      .map((user) => [this.onlineClients.get(user.id), user]);

    currentOnlineClients.forEach(([receiverClient, user]) => {
      /**
       * 通知在聊天室中的所有用户需要接收新的消息
       */
      const socketMessage: IWebSocketMessage<Message> = {
        event: WebSocketEventType.NEW_MESSAGE,
        payload: message,
      };
      receiverClient.send(JSON.stringify(socketMessage));
      Logger.log(`成功想用户[${user.id}]发送消息`);
    });
  }
}
