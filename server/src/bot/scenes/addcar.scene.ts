import { Injectable } from '@nestjs/common';
import { Wizard, WizardStep, Ctx } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { BotMessage, MediaItem } from '../bot.message';
import { BotService } from '../bot.service';
import { Car } from 'src/car/car.schema';
import { MyWizardContext } from '../interfaces/contexUserApp';

// export interface AddCarWizardState extends Scenes.WizardSessionData {
// данные для редактирования (из базы)
// car?: CarDocument;

// поля, которые будут накапливаться в ходе wizard
// marka?: string;
// model?: string;
// age?: string;
// info?: string;
// media?: MediaItem[];
// }

export interface AddCarWizardState extends Scenes.WizardSessionData {
  marka?: string;
  model?: string;
  age?: string;
  info?: string;
  media?: MediaItem[];
}

@Injectable()
@Wizard('addcar')
export class AddCar {
  constructor(
    private botMessage: BotMessage,
    private botService: BotService,
  ) {}

  private data = ['marka', 'model', 'age', 'vin', 'info', 'media'];
  private wizLength = this.data.length;

  private topTextLine(ctx: MyWizardContext, text: string) {
    return `${text}\n<i>Шаг ${ctx.wizard.cursor + 1} из ${this.wizLength}</i>`;
  }

  private formCar(ctx: MyWizardContext) {
    return { ...ctx.scene.state, ownerTid: ctx.user.tId } as Car;
  }

  private async control(ctx: MyWizardContext) {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const data = ctx.callbackQuery.data;

      if (data === 'leaveScene') {
        await ctx.scene.leave();
        await this.botService.start(ctx.user, ctx.app);
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
        const newCar = this.formCar(ctx);
        await this.botService.createCar(ctx.user, ctx.app, newCar);
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
    if (
      !(
        (ctx.message && 'photo' in ctx.message) ||
        (ctx.message && 'video' in ctx.message)
      )
    ) {
      if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
        return ctx.callbackQuery.data !== 'nextStep';
      }
      await ctx.deleteMessage();
      return true;
    }

    const mediaItem: MediaItem = {
      file_id: '',
      type: 'photo',
    };
    if (ctx.message && 'photo' in ctx.message) {
      const photos = ctx.message.photo;
      mediaItem.file_id = photos[photos.length - 1].file_id;
      mediaItem.type = 'photo';
    } else if (ctx.message && 'video' in ctx.message) {
      mediaItem.file_id = ctx.message.video.file_id;
      mediaItem.type = 'video';
    }
    if (!Array.isArray(ctx.scene.state[field])) {
      ctx.scene.state[field] = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ctx.scene.state[field].push(mediaItem);
    await ctx.deleteMessage();
    return false;
  }

  private async saveText(ctx: MyWizardContext, data: string) {
    if (ctx.message && 'text' in ctx.message) {
      ctx.scene.state[data] = ctx.message.text;
      await ctx.deleteMessage();
      return false;
    }
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      return ctx.callbackQuery.data !== 'nextStep';
    }
    await ctx.deleteMessage();
    return true;
  }

  private existDataList(ctx: MyWizardContext, data: string) {
    if (!ctx.scene.state[data]) return '';
    return `${ctx.scene.state[data]}`;
  }

  private existData(data: any) {
    if (!data) return '';
    return `\nВаш выбор: <i>${data}</i>`;
  }

  private readyList(ctx: MyWizardContext) {
    return `<b>${this.existDataList(ctx, 'marka')} ${this.existDataList(ctx, 'model')} ${this.existDataList(ctx, 'age')}</b>\n${this.existDataList(ctx, 'vin')}\n${this.existDataList(ctx, 'info')}`;
  }

  @WizardStep(1)
  async step1(@Ctx() ctx: MyWizardContext) {
    console.log(ctx.scene.state);
    const data = this.existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);
    const textTop = this.topTextLine(ctx, 'Необходимо отправить текст');
    const textDown = `<b>Марка авто</b>\n<i>Пример: Geely</i>${data}`;
    const keyboard = [[{ text: 'Отмена', callback_data: 'leaveScene' }]];
    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }
    const media: MediaItem[] =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as MediaItem[])
        : [];

    await this.botMessage.sendTopDownMessage(
      ctx.user,
      ctx.app,
      textTop,
      textDown,
      media,
      keyboard,
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveText(ctx, this.data[ctx.wizard.cursor - 1])) return;

    const data = this.existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);
    const textTop = this.topTextLine(ctx, 'Необходимо отправить текст');
    const textDown = `<b>Модель авто</b>\n<i>Пример: Coolray</i>${data}`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media: MediaItem[] =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as MediaItem[])
        : [];

    await this.botMessage.sendTopDownMessage(
      ctx.user,
      ctx.app,
      textTop,
      textDown,
      media,
      keyboard,
    );
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveText(ctx, this.data[ctx.wizard.cursor - 1])) return;

    const data = this.existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);
    const textTop = this.topTextLine(ctx, 'Необходимо отправить текст');
    const textDown = `<b>Год выпуска</b>\n<i>Пример: 2021</i>${data}`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media: MediaItem[] =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as MediaItem[])
        : [];

    await this.botMessage.sendTopDownMessage(
      ctx.user,
      ctx.app,
      textTop,
      textDown,
      media,
      keyboard,
    );
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveText(ctx, this.data[ctx.wizard.cursor - 1])) return;

    const data = this.existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);
    const textTop = this.topTextLine(ctx, 'Необходимо отправить текст');
    const textDown = `<b>VIN</b>\n<i>Пример: ZIMZMS78SSM7SFSM</i>\n(иногда помогает определить версию мультимедия)${data}`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media: MediaItem[] =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as MediaItem[])
        : [];

    await this.botMessage.sendTopDownMessage(
      ctx.user,
      ctx.app,
      textTop,
      textDown,
      media,
      keyboard,
    );
    ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveText(ctx, this.data[ctx.wizard.cursor - 1])) return;

    const data = this.existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);
    const textTop = this.topTextLine(ctx, 'Необходимо отправить текст');
    const textDown = `<b>Дополнительная информация</b>\n<i>Пример: Комплектация "Престиж", ! ПРОШИВАЛСЯ ИЛИ БЫЛА ПОПЫТКА !, рестайлинг и т.п., так же всё, что вы считаете необходимым сообщить или спросить</i>${data}`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media: MediaItem[] =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as MediaItem[])
        : [];

    await this.botMessage.sendTopDownMessage(
      ctx.user,
      ctx.app,
      textTop,
      textDown,
      media,
      keyboard,
    );
    ctx.wizard.next();
  }

  @WizardStep(6)
  async step6(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveText(ctx, this.data[ctx.wizard.cursor - 1])) return;

    const data = this.existData(ctx.scene.state[this.data[ctx.wizard.cursor]]);
    const textTop = this.topTextLine(
      ctx,
      'Необходимо отправить фото или видео',
    );
    const textDown = `<b>Фото или видео</b>\n<i>Важно: вся передняя панель, мультимедия, если получается фото версии прошивки, фото снаружи</i>\n(иногда важно для редких модификаций)`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Ok', callback_data: 'nextStep' });
    }

    const media: MediaItem[] =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as MediaItem[])
        : [];

    await this.botMessage.sendTopDownMessage(
      ctx.user,
      ctx.app,
      textTop,
      textDown,
      media,
      keyboard,
    );
    ctx.wizard.next();
  }

  @WizardStep(7)
  async step7(@Ctx() ctx: MyWizardContext) {
    if (await this.control(ctx)) return;

    if (await this.saveMediaAlbum(ctx, 'media')) return;
    const textTop = 'Максимум 10 фото или видео';
    const textDown = `${this.readyList(ctx)}`;

    const keyboard = [
      [
        { text: 'Редактировать', callback_data: 'edit' },
        { text: 'Отмена', callback_data: 'leaveScene' },
        { text: 'Создать запрос', callback_data: 'create' },
      ],
    ];

    const media: MediaItem[] =
      'media' in ctx.scene.state
        ? (ctx.scene.state['media'] as MediaItem[])
        : [];

    await this.botMessage.sendTopDownMessage(
      ctx.user,
      ctx.app,
      textTop,
      textDown,
      media,
      keyboard,
    );
  }
}
