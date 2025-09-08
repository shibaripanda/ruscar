import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import {
  InlineKeyboardButton,
  InputMediaPhoto,
  InputMediaVideo,
  InputMediaDocument,
} from 'telegraf/typings/core/types/typegram';
import {
  ExtraPhoto,
  ExtraVideo,
  ExtraDocument,
  ExtraAnimation,
  ExtraReplyMessage,
} from 'telegraf/typings/telegram-types';
import { UserDocument } from 'src/user/user.schema';
import { AppDocument } from 'src/app/app.schema';
import { InjectBot } from 'nestjs-telegraf';

type MediaItem = { file_id: string };

@Injectable()
export class BotMessage {
  constructor(@InjectBot() private bot: Telegraf) {
    console.log('BotMessage initialized');
  }

  async sendMessageToUser(
    user: UserDocument,
    app: AppDocument,
    text?: string,
    keyboard?: InlineKeyboardButton[][],
    media?: MediaItem[],
  ) {
    try {
      const options: ExtraReplyMessage = {};
      if (keyboard?.length) {
        options.reply_markup = { inline_keyboard: keyboard };
      }

      // 1) Есть медиа
      if (media?.length) {
        if (media.length === 1) {
          await this.sendSingleMedia(user.tId, media[0], text, keyboard);
        } else {
          await this.sendMediaGroup(user.tId, media, text);
          // клавиатура после альбома
          if (keyboard?.length) {
            await this.bot.telegram.sendMessage(user.tId, ' ', options);
          }
        }
        return;
      }

      // 2) Только текст
      if (text) {
        await this.bot.telegram.sendMessage(user.tId, text, options);
        return;
      }

      // 3) Только клавиатура
      if (keyboard?.length) {
        await this.bot.telegram.sendMessage(user.tId, ' ', options);
        return;
      }

      // 4) Нечего отправлять
      throw new Error('Нечего отправлять пользователю');
    } catch (e) {
      console.error(`Ошибка отправки сообщения пользователю ${user.tId}:`, e);
    }
  }

  /** Отправка одного медиа с корректной типизацией */
  private async sendSingleMedia(
    chatId: number,
    item: MediaItem,
    text?: string,
    keyboard?: InlineKeyboardButton[][],
  ) {
    const type = await this.detectMediaType(item.file_id);

    switch (type) {
      case 'photo': {
        const options: ExtraPhoto = {};
        if (keyboard?.length)
          options.reply_markup = { inline_keyboard: keyboard };
        await this.bot.telegram.sendPhoto(chatId, item.file_id, {
          caption: text,
          ...options,
        });
        break;
      }
      case 'video': {
        const options: ExtraVideo = {};
        if (keyboard?.length)
          options.reply_markup = { inline_keyboard: keyboard };
        await this.bot.telegram.sendVideo(chatId, item.file_id, {
          caption: text,
          ...options,
        });
        break;
      }
      case 'animation': {
        const options: ExtraAnimation = {};
        if (keyboard?.length)
          options.reply_markup = { inline_keyboard: keyboard };
        await this.bot.telegram.sendAnimation(chatId, item.file_id, {
          caption: text,
          ...options,
        });
        break;
      }
      case 'document':
      default: {
        const options: ExtraDocument = {};
        if (keyboard?.length)
          options.reply_markup = { inline_keyboard: keyboard };
        await this.bot.telegram.sendDocument(chatId, item.file_id, {
          caption: text,
          ...options,
        });
        break;
      }
    }
  }

  /** Отправка альбома (media group) с разделением по типам */
  private async sendMediaGroup(
    chatId: number,
    media: MediaItem[],
    text?: string,
  ) {
    const photos: InputMediaPhoto[] = [];
    const videos: InputMediaVideo[] = [];
    const documents: InputMediaDocument[] = [];

    for (let i = 0; i < media.length; i++) {
      const item = media[i];
      const type = await this.detectMediaType(item.file_id);
      const caption = i === 0 && text ? text : undefined;

      switch (type) {
        case 'photo':
          photos.push({ type: 'photo', media: item.file_id, caption });
          break;
        case 'video':
          videos.push({ type: 'video', media: item.file_id, caption });
          break;
        case 'document':
        default:
          documents.push({ type: 'document', media: item.file_id, caption });
          break;
      }
    }

    // Отправляем каждую группу отдельно
    if (photos.length) await this.bot.telegram.sendMediaGroup(chatId, photos);
    if (videos.length) await this.bot.telegram.sendMediaGroup(chatId, videos);
    if (documents.length)
      await this.bot.telegram.sendMediaGroup(chatId, documents);
  }

  /** Определяет тип медиафайла по file_id */
  private async detectMediaType(
    fileId: string,
  ): Promise<'photo' | 'video' | 'document' | 'animation'> {
    try {
      const file = await this.bot.telegram.getFile(fileId);
      const ext = file.file_path?.split('.').pop()?.toLowerCase();
      if (!ext) return 'document';
      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'photo';
      if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
      if (['gif'].includes(ext)) return 'animation';
      return 'document';
    } catch (e) {
      console.error(`Ошибка определения типа медиа для ${fileId}:`, e);
      return 'document';
    }
  }
}
