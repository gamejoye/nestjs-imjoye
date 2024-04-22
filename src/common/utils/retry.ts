import { RawData, WebSocket } from 'ws';
import { IWebSocketMessage } from '../types/base.type';

export async function websocketRetry<T>(
  client: WebSocket,
  retryOperation: () => void,
  isSuccess: (result: IWebSocketMessage<T>) => boolean,
  interval: number = 500,
  maxRetries: number = 50,
  currentRetry: number = 0,
) {
  if (currentRetry <= maxRetries) {
    retryOperation();
    const listern = (rawData: RawData) => {
      const socketMessage: IWebSocketMessage<T> = JSON.parse(
        rawData.toString('utf-8'),
      );
      if (isSuccess(socketMessage)) {
        clearTimeout(timeoutId);
      }
    };
    const timeoutId = setTimeout(() => {
      websocketRetry(
        client,
        retryOperation,
        isSuccess,
        interval,
        maxRetries,
        currentRetry + 1,
      );
      client.off('message', listern);
    }, interval);
    client.on('message', listern);
  } else {
    console.log(`操作最大操作限制次数`);
  }
}
