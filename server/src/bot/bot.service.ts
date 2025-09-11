import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/user/user.schema';
import { AppDocument } from 'src/app/app.schema';
import { BotMessage } from './bot.message';

@Injectable()
export class BotService {
  constructor(
    @Inject(forwardRef(() => BotMessage))
    private botMessage: BotMessage,
  ) {
    console.log('BotService initialized');
  }

  async start(user: UserDocument, app: AppDocument) {
    const topText = 'Русификация';
    const downText = 'Запрос';
    const keyboard = [
      [{ text: 'Добавить авто', callback_data: 'test' }],
      [{ text: 'Инструкция', callback_data: 'help' }],
    ];
    const media = [];
    await this.botMessage.sendTopDownMessage(
      user,
      app,
      topText,
      downText,
      media,
      keyboard,
    );
  }
}
