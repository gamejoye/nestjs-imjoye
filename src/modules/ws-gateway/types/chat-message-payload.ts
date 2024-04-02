import { Message } from 'src/modules/messages/entities/message.entity';

export class ChatMessagePayload {
  from: number;

  message: Message;
}
