import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import {
  InlineKeyboardButton,
  InputMediaPhoto,
  InputMediaVideo,
  InlineKeyboardMarkup,
} from 'telegraf/typings/core/types/typegram';
import { UserDocument } from 'src/user/user.schema';
import { AppDocument } from 'src/app/app.schema';
import { InjectBot } from 'nestjs-telegraf';
import { BotService } from './bot.service';

export type MediaItem = { file_id: string; type: 'photo' | 'video' };

@Injectable()
export class BotMessage {
  constructor(
    @InjectBot() private bot: Telegraf,
    @Inject(forwardRef(() => BotService))
    private botService: BotService,
  ) {
    console.log('BotMessage initialized');
  }

  truncateCaption(text: string, maxLength = 1024): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }

  async sendTopDownMessage(
    user: UserDocument,
    app: AppDocument,
    topText: string,
    downText: string,
    media: MediaItem[],
    keyboard: InlineKeyboardButton[][],
  ) {
    await this.sendTopMessage(user, app, topText, media);
    await this.sendDownMessage(user, app, downText, keyboard);
  }

  async sendTopMessage(
    user: UserDocument,
    app: AppDocument,
    topText: string,
    media: MediaItem[],
  ) {
    console.log('ssssss');
    const mediaGroup: (InputMediaPhoto | InputMediaVideo)[] = [];
    for (const m of media) {
      if (media.indexOf(m) < 10) {
        mediaGroup.push({
          type: m.type,
          media: m.file_id,
        });
      }
    }
    while (mediaGroup.length < 10) {
      mediaGroup.push({
        type: 'photo',
        media: app.placeholderImage,
      });
    }
    mediaGroup[0].caption = this.truncateCaption(topText);
    mediaGroup[0].parse_mode = 'HTML';
    console.log(mediaGroup[0], mediaGroup[1]);
    if (user.topMessageId.length) {
      for (const messageId of user.topMessageId) {
        await this.bot.telegram
          .editMessageMedia(
            user.tId,
            messageId,
            undefined,
            mediaGroup[user.topMessageId.indexOf(messageId)],
          )
          .catch(async (e: { response: { description: string } }) => {
            console.log(e.response?.description);
            if (
              e.response?.description ===
              'Bad Request: message to edit not found'
            ) {
              user.downMessageId = 0;
              user.topMessageId = [];
              await user.save();
              await this.botService.start(user, app);
              return;
            }
          });
      }
      return;
    }

    const res = await this.bot.telegram
      .sendMediaGroup(user.tId, mediaGroup)
      .catch((e) => console.log(e));
    if (res) {
      user.topMessageId = res.map((msg) => msg.message_id);
      await user.save();
    }
  }

  async sendDownMessage(
    user: UserDocument,
    app: AppDocument,
    downText: string,
    keyboard: InlineKeyboardButton[][],
  ): Promise<any> {
    const options: { parse_mode: 'HTML'; reply_markup: InlineKeyboardMarkup } =
      {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: keyboard },
      };
    if (!user.downMessageId) {
      const res = await this.bot.telegram
        .sendMessage(user.tId, this.truncateCaption(downText, 4000), options)
        .catch((e) => console.log(e));
      console.log(3);
      if (res) {
        user.downMessageId = res.message_id;
        await user.save();
      }
      return;
    }
    await this.bot.telegram
      .editMessageText(
        user.tId,
        user.downMessageId,
        undefined,
        this.truncateCaption(downText, 4000),
        options,
      )
      .catch(async (e: { response: { description: string } }) => {
        console.log(e.response?.description);
        if (
          e.response?.description === 'Bad Request: message to edit not found'
        ) {
          user.downMessageId = 0;
          user.topMessageId = [];
          await user.save();
          await this.botService.start(user, app);
          return;
        }
      });
  }
}
