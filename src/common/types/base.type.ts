import { WebSocketEvent } from '../constants/websocketEvents';

export interface IDatabaseConfig {
  host: string;
  port: number;
  type: 'mysql';
  username: string;
  password: string;
  database: string;
}

export interface IJwtConfig {
  secret: string;
}

export interface IWebSocketMessage<T> {
  event: WebSocketEvent;
  payload: T;
}

export interface IAvatarConfig {
  avatarDir: string;
  avatarUrl: string;
}
