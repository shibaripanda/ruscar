import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/user/user.schema';
import { AppDocument } from 'src/app/app.schema';
import { BotMessage } from './bot.message';

@Injectable()
export class BotService {
  constructor(private botMessage: BotMessage) {
    console.log('BotService initialized');
  }

  async start(user: UserDocument, app: AppDocument) {
    const text = 'Добавить';
    const keyboard = [[{ text: 'Добавить авто', callback_data: 'test' }]];
    const media = [];
    await this.botMessage.sendMessageToUser(user, app, text, keyboard, media);
  }
}
