import { Injectable } from '@nestjs/common';
import { Wizard, WizardStep, Ctx } from 'nestjs-telegraf';
import { Context, Scenes } from 'telegraf';
import { BotMessage } from '../bot.message';
import { UserDocument } from 'src/user/user.schema';
import { AppDocument } from 'src/app/app.schema';

const existData = (data: any) => {
  if (!data) return '';
  return `\nВаш выбор: <b>${data}</b>`;
};

export interface AddCarWizardState extends Scenes.WizardSessionData {
  marka?: string;
  model?: string;
  age?: string;
  info?: string;
  media?: { file_id: string }[];
}

export interface MyWizardContext
  extends Context,
    Scenes.WizardContext<AddCarWizardState> {
  user: UserDocument;
  app: AppDocument;
}

@Injectable()
@Wizard('test')
export class Test {
  constructor(private botMessage: BotMessage) {}

  private mediaGroups = new Map<
    string,
    { timeout?: NodeJS.Timeout; files: { file_id: string }[] }
  >();

  private data = ['marka', 'model', 'age', 'info', 'media'];
  private wizLength = this.data.length;

  private async control(ctx: MyWizardContext) {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const data = ctx.callbackQuery.data;

      if (data === 'leaveScene') {
        await ctx.scene.leave();
        await ctx.answerCbQuery();
        return true;
      }
      if (data === 'edit') {
        await ctx.scene.reenter();
        await ctx.answerCbQuery();
        return true;
      }
      if (data === 'nextStep') {
        await ctx.answerCbQuery();
        return false;
      }
      if (data === 'create') {
        console.log(ctx.scene.state);
        await ctx.scene.leave();
        await ctx.answerCbQuery();
        return true;
      }
      await ctx.answerCbQuery();
    }
    return false;
  }

  private async saveMediaAlbum(
    ctx: MyWizardContext,
    field: string,
  ): Promise<boolean> {
    // Если это не фото и не видео → обрабатываем кнопки
    if (
      !(
        (ctx.message && 'photo' in ctx.message) ||
        (ctx.message && 'video' in ctx.message)
      )
    ) {
      if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
        return ctx.callbackQuery.data !== 'nextStep';
      }
      await ctx.reply('Необходимо отправить фото или видео');
      return true;
    }

    let file_id = '';
    if (ctx.message && 'photo' in ctx.message) {
      const photos = ctx.message.photo;
      file_id = photos[photos.length - 1].file_id;
    } else if (ctx.message && 'video' in ctx.message) {
      file_id = ctx.message.video.file_id;
    }

    // Если это альбом
    if ('media_group_id' in ctx.message) {
      // setTimeout(() => {
      if (!Array.isArray(ctx.scene.state[field])) {
        ctx.scene.state[field] = [];
      }
      ctx.scene.state[field].push({ file_id });
      // }, 400);
      return false;
    }

    if (!Array.isArray(ctx.scene.state[field])) {
      ctx.scene.state[field] = [];
    }
    ctx.scene.state[field].push({ file_id });

    return false;
  }

  private async saveText(ctx: MyWizardContext, data: string) {
    if (ctx.message && 'text' in ctx.message) {
      ctx.scene.state[data] = ctx.message.text;
      return false;
    }
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      return ctx.callbackQuery.data !== 'nextStep';
    }
    await ctx.reply('Необходимо отправить текст');
    return true;
  }

  @WizardStep(1)
  async step1(@Ctx() ctx: MyWizardContext) {
    const data = existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);

    const text = `<b>Марка авто</b> (${ctx.wizard.cursor + 1}/${this.wizLength})\nПример: Geely${data}`;

    const keyboard = [[{ text: 'Отмена', callback_data: 'leaveScene' }]];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as { file_id: string }[])
        : [
            {
              file_id:
                'AgACAgIAAxkBAAK1SmjAhdehbvgnkVgQscmk9cROkQiMAAJ8_TEbN8oBSur3tCOPliiGAQADAgADeQADNgQ',
            },
          ];

    await this.botMessage.sendMessageToUser(
      ctx.user,
      ctx.app,
      text,
      keyboard,
      media,
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveText(ctx, this.data[ctx.wizard.cursor - 1])) return;

    const data = existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);

    const text = `<b>Модель авто</b> (${ctx.wizard.cursor + 1}/${this.wizLength})\nПример: Coolray${data}`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as { file_id: string }[])
        : [
            {
              file_id:
                'AgACAgIAAxkBAAK1SmjAhdehbvgnkVgQscmk9cROkQiMAAJ8_TEbN8oBSur3tCOPliiGAQADAgADeQADNgQ',
            },
          ];

    await this.botMessage.sendMessageToUser(
      ctx.user,
      ctx.app,
      text,
      keyboard,
      media,
    );
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveText(ctx, this.data[ctx.wizard.cursor - 1])) return;

    const data = existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);

    const text = `<b>Год выпуска</b> (${ctx.wizard.cursor + 1}/${this.wizLength})\nПример: 2021${data}`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as { file_id: string }[])
        : [
            {
              file_id:
                'AgACAgIAAxkBAAK1SmjAhdehbvgnkVgQscmk9cROkQiMAAJ8_TEbN8oBSur3tCOPliiGAQADAgADeQADNgQ',
            },
          ];

    await this.botMessage.sendMessageToUser(
      ctx.user,
      ctx.app,
      text,
      keyboard,
      media,
    );
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveText(ctx, this.data[ctx.wizard.cursor - 1])) return;

    const data = existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);

    const text = `<b>Дополнительная информация</b> (${ctx.wizard.cursor + 1}/${this.wizLength})\nПример: Комплектация "Престиж", рестайлинг и т.п. ${data}`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as { file_id: string }[])
        : [
            {
              file_id:
                'AgACAgIAAxkBAAK1SmjAhdehbvgnkVgQscmk9cROkQiMAAJ8_TEbN8oBSur3tCOPliiGAQADAgADeQADNgQ',
            },
          ];

    await this.botMessage.sendMessageToUser(
      ctx.user,
      ctx.app,
      text,
      keyboard,
      media,
    );
    ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveText(ctx, this.data[ctx.wizard.cursor - 1])) return;

    const data = existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);

    const text = `<b>Фото или видео</b> (${ctx.wizard.cursor + 1}/${this.wizLength})`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media = [
      {
        file_id:
          'AgACAgIAAxkBAAK1SmjAhdehbvgnkVgQscmk9cROkQiMAAJ8_TEbN8oBSur3tCOPliiGAQADAgADeQADNgQ',
      },
    ];

    await this.botMessage.sendMessageToUser(
      ctx.user,
      ctx.app,
      text,
      keyboard,
      media,
    );
    ctx.wizard.next();
  }

  @WizardStep(6)
  async step6(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveMediaAlbum(ctx, 'media')) return;

    const text = `<b>Готово</b>\n${ctx.scene.state['marka']} ${ctx.scene.state['model']} ${ctx.scene.state['age']}г.\n${ctx.scene.state['info']}`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
        { text: 'Создать запрос', callback_data: 'create' },
      ],
    ];

    const media =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as { file_id: string }[])
        : [
            {
              file_id:
                'AgACAgIAAxkBAAK1SmjAhdehbvgnkVgQscmk9cROkQiMAAJ8_TEbN8oBSur3tCOPliiGAQADAgADeQADNgQ',
            },
          ];

    await this.botMessage.sendMessageToUser(
      ctx.user,
      ctx.app,
      text,
      keyboard,
      media,
    );
  }
}
