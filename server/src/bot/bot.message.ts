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

export type MediaItem = { file_id: string; type: 'photo' | 'video' };

@Injectable()
export class BotMessage {
  constructor(@InjectBot() private bot: Telegraf) {
    console.log('BotMessage initialized');
  }

  // async message(screen, userId, userData, toData) {
  //   let eventKeyboard = [];
  //   let mes;
  //   const ticketPik = '🎟';

  //   if (screen.mode === 'event') {
  //     const event = new EventClass(
  //       await this.getEvent(screen.event_id),
  //       screen._id,
  //     );

  //     screen.text =
  //       screen.text +
  //       '\n\n🔹 ' +
  //       event.name +
  //       '\n' +
  //       (await this.findUserReg(event.days, userId));

  //     if (toData) {
  //       if (toData[1] === 'to_mounth') {
  //         // console.log('to_mounth')
  //         const res = await event.getKeyboardEventMounth(toData[2]);
  //         screen.text = screen.text + ticketPik + res.text;
  //         eventKeyboard = res.keyboard;
  //       } else if (toData[1] === 'to_days') {
  //         // console.log('to_days')
  //         const res = await event.getKeyboardEventDays(toData[2], toData[3]);
  //         screen.text = screen.text + ticketPik + res.text;
  //         eventKeyboard = res.keyboard;
  //       } else if (toData[1] === 'to_slots') {
  //         // console.log('to_slots')
  //         const res = await event.getKeyboardEventSlots(
  //           toData[2],
  //           toData[3],
  //           toData[4],
  //         );
  //         screen.text = screen.text + ticketPik + res.text;
  //         eventKeyboard = res.keyboard;
  //       } else if (toData[1] === 'prereg') {
  //         // console.log('prereg')
  //         const res = await event.getKeyboardEventPreReg(
  //           toData[2],
  //           toData[3],
  //           toData[4],
  //           toData[5],
  //           userId,
  //         );
  //         screen.text = screen.text + ticketPik + res.text;
  //         eventKeyboard = res.keyboard;
  //       } else if (toData[1] === 'reg') {
  //         // console.log('reg')
  //         const userInfo = (
  //           await this.bot.telegram.getChatMember(userId, userId)
  //         ).user;
  //         const res = await event.regEvent(
  //           toData[2],
  //           toData[3],
  //           toData[4],
  //           toData[5],
  //           userId,
  //           userInfo,
  //         );
  //         screen.text = screen.text + ticketPik + res.text;
  //         eventKeyboard = res.keyboard;
  //         SocketApt.socket.emit('updateEventInfo', {
  //           botId: this._id,
  //           token: process.env.SERVER_TOKEN,
  //           idEvent: event.idEvent,
  //         });
  //       } else {
  //         // console.log('to_years')
  //         const res = await event.getKeyboardEventYears();
  //         eventKeyboard = res.keyboard;
  //         if (eventKeyboard.length === 1 && eventKeyboard[0][0].to !== 'zero') {
  //           const res = await event.getKeyboardEventMounth(
  //             eventKeyboard[0][0].text,
  //           );
  //           eventKeyboard = res.keyboard;
  //           if (
  //             !(eventKeyboard.length === 2 && eventKeyboard[1][0].to !== 'zero')
  //           )
  //             screen.text = screen.text + ticketPik + res.text;
  //           if (
  //             eventKeyboard.length === 2 &&
  //             eventKeyboard[1][0].to !== 'zero'
  //           ) {
  //             const link = eventKeyboard[1][0].to.split('|');
  //             const res = await event.getKeyboardEventDays(link[2], link[3]);
  //             eventKeyboard = res.keyboard;
  //             if (
  //               !(
  //                 eventKeyboard.length === 2 &&
  //                 eventKeyboard[1][0].to !== 'zero'
  //               )
  //             )
  //               screen.text = screen.text + ticketPik + res.text;
  //             if (
  //               eventKeyboard.length === 2 &&
  //               eventKeyboard[1][0].to !== 'zero'
  //             ) {
  //               const link = eventKeyboard[1][0].to.split('|');
  //               const res = await event.getKeyboardEventSlots(
  //                 link[2],
  //                 link[3],
  //                 link[4],
  //               );
  //               screen.text = screen.text + ticketPik + res.text;
  //               eventKeyboard = res.keyboard;
  //             }
  //           }
  //         }
  //       }
  //     } else {
  //       const res = await event.getKeyboardEventYears();
  //       screen.text = screen.text + `\n\n` + ticketPik + res.text;
  //       eventKeyboard = res.keyboard;
  //     }
  //   }
  //   if (userData) {
  //     for (const key in userData) {
  //       screen.text = screen.text.replaceAll(`<$>${key}<$>`, userData[key]);
  //     }
  //     for (const key in userData) {
  //       screen.text = screen.text.replaceAll(`<$>${key}<$>`, '');
  //     }
  //   }
  //   const keyboard = () => {
  //     if (screen.buttons.length || eventKeyboard.length) {
  //       const res = [];
  //       for (const i of eventKeyboard.concat(screen.buttons)) {
  //         res.push(
  //           i.map((item) => Markup.button[item.action](item.text, item.to)),
  //         );
  //       }
  //       return Markup.inlineKeyboard(res);
  //     }
  //   };
  //   const emptyText = () => {
  //     if (screen.text == '') return '------------------------------';
  //     return screen.text;
  //   };

  //   if (
  //     !screen.media.length &&
  //     !screen.document.length &&
  //     !screen.audio.length &&
  //     screen.text == ''
  //   ) {
  //     mes = await this.bot.telegram
  //       .sendMessage(
  //         userId,
  //         `Empty screen.\nAdd content: videos, photos, voice, audio, files or text`,
  //         { protect_content: screen.protect, parse_mode: 'HTML' },
  //       )
  //       .catch((error) => console.log(error));
  //   } else {
  //     if (screen.text && screen.text.length > 1000) {
  //       if (screen.document.length) {
  //         mes = await this.bot.telegram
  //           .sendMediaGroup(userId, screen.document, {
  //             protect_content: screen.protect,
  //             parse_mode: 'HTML',
  //           })
  //           .catch((error) => console.log(error));
  //       }
  //       if (screen.audio.length) {
  //         for (let mes of screen.audio) {
  //           mes = await this.bot.telegram
  //             .sendAudio(userId, mes.media, {
  //               protect_content: screen.protect,
  //               parse_mode: 'HTML',
  //             })
  //             .catch((error) => console.log(error));
  //         }
  //       }
  //       if (screen.media.length) {
  //         mes = await this.bot.telegram
  //           .sendMediaGroup(userId, screen.media, {
  //             protect_content: screen.protect,
  //             parse_mode: 'HTML',
  //           })
  //           .catch((error) => console.log(error));
  //       }
  //       mes = await this.bot.telegram
  //         .sendMessage(userId, emptyText(), {
  //           ...keyboard(),
  //           protect_content: screen.protect,
  //           parse_mode: 'HTML',
  //         })
  //         .catch((error) => console.log(error));
  //     } else {
  //       if (
  //         screen.media.length &&
  //         !screen.document.length &&
  //         !screen.audio.length
  //       ) {
  //         if (screen.media.length == 1 && screen.media[0].type == 'photo') {
  //           mes = await this.bot.telegram
  //             .sendPhoto(userId, screen.media[0].media, {
  //               ...keyboard(),
  //               caption: screen.text,
  //               protect_content: screen.protect,
  //               parse_mode: 'HTML',
  //             })
  //             .catch((error) => console.log(error));
  //         } else if (
  //           screen.media.length == 1 &&
  //           screen.media[0].type == 'video'
  //         ) {
  //           mes = await this.bot.telegram
  //             .sendVideo(userId, screen.media[0].media, {
  //               ...keyboard(),
  //               caption: screen.text,
  //               protect_content: screen.protect,
  //               parse_mode: 'HTML',
  //             })
  //             .catch((error) => console.log(error));
  //         } else {
  //           if (!screen.buttons.length) {
  //             screen.media[0].caption = screen.text;
  //             mes = await this.bot.telegram
  //               .sendMediaGroup(userId, screen.media, {
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           } else {
  //             mes = await this.bot.telegram
  //               .sendMediaGroup(userId, screen.media, {
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //             mes = await this.bot.telegram
  //               .sendMessage(userId, emptyText(), {
  //                 ...keyboard(),
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           }
  //         }
  //       } else if (
  //         !screen.media.length &&
  //         screen.document.length &&
  //         !screen.audio.length
  //       ) {
  //         if (screen.document.length == 1) {
  //           mes = await this.bot.telegram
  //             .sendDocument(userId, screen.document[0].media, {
  //               ...keyboard(),
  //               caption: screen.text,
  //               protect_content: screen.protect,
  //               parse_mode: 'HTML',
  //             })
  //             .catch((error) => console.log(error));
  //         } else {
  //           if (!screen.buttons.length) {
  //             screen.document[screen.document.length - 1].caption = screen.text;
  //             mes = await this.bot.telegram
  //               .sendMediaGroup(userId, screen.document, {
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           } else {
  //             mes = await this.bot.telegram
  //               .sendMediaGroup(userId, screen.document, {
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //             mes = await this.bot.telegram
  //               .sendMessage(userId, emptyText(), {
  //                 ...keyboard(),
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           }
  //         }
  //       } else if (
  //         !screen.media.length &&
  //         !screen.document.length &&
  //         screen.audio.length
  //       ) {
  //         for (let mes of screen.audio) {
  //           if (screen.audio.indexOf(mes) == screen.audio.length - 1) {
  //             mes = await this.bot.telegram
  //               .sendAudio(userId, mes.media, {
  //                 ...keyboard(),
  //                 caption: screen.text,
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           } else {
  //             mes = await this.bot.telegram
  //               .sendAudio(userId, mes.media, {
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           }
  //         }
  //       } else {
  //         if (screen.document.length) {
  //           mes = await this.bot.telegram
  //             .sendMediaGroup(userId, screen.document, {
  //               protect_content: screen.protect,
  //               parse_mode: 'HTML',
  //             })
  //             .catch((error) => console.log(error));
  //         }
  //         if (screen.audio.length) {
  //           for (let mes of screen.audio) {
  //             mes = await this.bot.telegram
  //               .sendAudio(userId, mes.media, {
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           }
  //         }
  //         if (screen.media.length) {
  //           if (screen.media.length == 1 && screen.media[0].type == 'photo') {
  //             mes = await this.bot.telegram
  //               .sendPhoto(userId, screen.media[0].media, {
  //                 ...keyboard(),
  //                 caption: screen.text,
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           } else if (
  //             screen.media.length == 1 &&
  //             screen.media[0].type == 'video'
  //           ) {
  //             mes = await this.bot.telegram
  //               .sendVideo(userId, screen.media[0].media, {
  //                 ...keyboard(),
  //                 caption: screen.text,
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           } else {
  //             if (!screen.buttons.length) {
  //               screen.media[0].caption = screen.text;
  //               mes = await this.bot.telegram
  //                 .sendMediaGroup(userId, screen.media, {
  //                   protect_content: screen.protect,
  //                   parse_mode: 'HTML',
  //                 })
  //                 .catch((error) => console.log(error));
  //             } else {
  //               mes = await this.bot.telegram
  //                 .sendMediaGroup(userId, screen.media, {
  //                   protect_content: screen.protect,
  //                   parse_mode: 'HTML',
  //                 })
  //                 .catch((error) => console.log(error));
  //               mes = await this.bot.telegram
  //                 .sendMessage(userId, emptyText(), {
  //                   ...keyboard(),
  //                   protect_content: screen.protect,
  //                   parse_mode: 'HTML',
  //                 })
  //                 .catch((error) => console.log(error));
  //             }
  //           }
  //         } else {
  //           if (screen.buttons.length || screen.text) {
  //             mes = await this.bot.telegram
  //               .sendMessage(userId, emptyText(), {
  //                 ...keyboard(),
  //                 protect_content: screen.protect,
  //                 parse_mode: 'HTML',
  //               })
  //               .catch((error) => console.log(error));
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return mes.date;
  // }
  truncateCaption(text: string, maxLength = 1024): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }

  async sendMessageToUser(
    user: UserDocument,
    app: AppDocument,
    text: string,
    keyboard?: InlineKeyboardButton[][],
    media?: MediaItem[],
  ): Promise<any> {
    let res: any;
    const options: ExtraReplyMessage = { parse_mode: 'HTML' };
    if (
      (!keyboard || keyboard.length === 0) &&
      (!media || media.length === 0)
    ) {
      res = await this.bot.telegram.sendMessage(
        user.tId,
        this.truncateCaption(text, 4000),
        options,
      );
      console.log(1);
      return res;
    }
    if (keyboard && keyboard.length && media && media.length === 1) {
      options.reply_markup = { inline_keyboard: keyboard };
      if (media[0].type === 'photo') {
        res = await this.bot.telegram.sendPhoto(user.tId, media[0].file_id, {
          caption: this.truncateCaption(text),
          ...options,
        });
      } else if (media[0].type === 'video') {
        res = await this.bot.telegram.sendVideo(user.tId, media[0].file_id, {
          caption: this.truncateCaption(text),
          ...options,
        });
      }
      console.log(2);
      return res;
    }
    if (keyboard && keyboard.length && media && media.length) {
      const mediaGroup: (InputMediaPhoto | InputMediaVideo)[] = [];
      for (const m of media) {
        if (media.indexOf(m) < 10) {
          if (media.indexOf(m) === 0) {
            mediaGroup.push({
              type: m.type,
              media: m.file_id,
            });
          } else {
            mediaGroup.push({ type: m.type, media: m.file_id });
          }
        }
      }
      res = await this.bot.telegram.sendMediaGroup(user.tId, mediaGroup);
      options.reply_markup = { inline_keyboard: keyboard };
      res = await this.bot.telegram.sendMessage(
        user.tId,
        this.truncateCaption(text),
        options,
      );
      console.log(2);
      return res;
    }
    if (keyboard && keyboard.length) {
      options.reply_markup = { inline_keyboard: keyboard };
      console.log(options);
      res = await this.bot.telegram.sendMessage(user.tId, text, options);
      console.log(3);
      return res;
    }
    if (media && media.length) {
      const mediaGroup: (InputMediaPhoto | InputMediaVideo)[] = [];
      for (const m of media) {
        if (media.indexOf(m) < 10) {
          if (media.indexOf(m) === 0) {
            mediaGroup.push({
              type: m.type,
              media: m.file_id,
              caption: this.truncateCaption(text),
            });
          } else {
            mediaGroup.push({ type: m.type, media: m.file_id });
          }
        }
      }
      res = await this.bot.telegram.sendMediaGroup(
        user.tId,
        mediaGroup,
        options,
      );
      console.log(4);
      return res;
    }
    console.log('нихуясо');
  }

  // async sendMessageToUser(
  //   user: UserDocument,
  //   app: AppDocument,
  //   text?: string,
  //   keyboard?: InlineKeyboardButton[][],
  //   media?: MediaItem[],
  // ) {
  //   try {
  //     const options: ExtraReplyMessage = { parse_mode: 'HTML' };
  //     if (keyboard?.length) {
  //       options.reply_markup = { inline_keyboard: keyboard };
  //     }

  //     // 1) Есть медиа
  //     if (media?.length) {
  //       if (media.length === 1) {
  //         await this.sendSingleMedia(user.tId, media[0], text, keyboard);
  //       } else {
  //         await this.sendMediaGroup(user.tId, media, text);
  //         // клавиатура после альбома
  //         if (keyboard?.length) {
  //           await this.bot.telegram.sendMessage(user.tId, '-----', options);
  //         }
  //       }
  //       return;
  //     }

  //     // 2) Только текст
  //     if (text) {
  //       await this.bot.telegram.sendMessage(user.tId, text, options);
  //       return;
  //     }

  //     // 3) Только клавиатура
  //     if (keyboard?.length) {
  //       await this.bot.telegram.sendMessage(user.tId, '-----', options);
  //       return;
  //     }

  //     // 4) Нечего отправлять
  //     throw new Error('Нечего отправлять пользователю');
  //   } catch (e) {
  //     console.error(`Ошибка отправки сообщения пользователю ${user.tId}:`, e);
  //   }
  // }

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
        const options: ExtraPhoto = { parse_mode: 'HTML' };
        if (keyboard?.length)
          options.reply_markup = { inline_keyboard: keyboard };
        await this.bot.telegram.sendPhoto(chatId, item.file_id, {
          caption: text,
          ...options,
        });
        break;
      }
      case 'video': {
        const options: ExtraVideo = { parse_mode: 'HTML' };
        if (keyboard?.length)
          options.reply_markup = { inline_keyboard: keyboard };
        await this.bot.telegram.sendVideo(chatId, item.file_id, {
          caption: text,
          ...options,
        });
        break;
      }
      case 'animation': {
        const options: ExtraAnimation = { parse_mode: 'HTML' };
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
        const options: ExtraDocument = { parse_mode: 'HTML' };
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
