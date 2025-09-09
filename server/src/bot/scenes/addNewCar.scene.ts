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
}

export interface MyWizardContext
  extends Context,
    Scenes.WizardContext<AddCarWizardState> {
  user: UserDocument;
  app: AppDocument;
}

@Injectable()
@Wizard('addNewCar')
export class AddNewCarScene {
  constructor(private botMessage: BotMessage) {}

  private async goToStepBack(ctx: MyWizardContext) {
    let step = ctx.wizard.cursor - 2;
    if (step < 0) step = 0;
    const res = `step${step}`;
    if (typeof this[res] === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this[res](ctx);
    } else {
      console.error(`Шага ${res} не существует!`);
      return ctx.reply('Произошла ошибка. Попробуйте снова.');
    }
  }

  private async goToStepNext(ctx: MyWizardContext) {
    const res = `step${ctx.wizard.cursor + 2}`;
    if (typeof this[res] === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this[res](ctx);
    } else {
      console.error(`Шага ${res} не существует!`);
      return ctx.reply('Произошла ошибка. Попробуйте снова.');
    }
  }

  @WizardStep(1)
  async step1(@Ctx() ctx: MyWizardContext) {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const data = ctx.callbackQuery.data;

      if (data === 'leaveScene') {
        await ctx.scene.leave();
        await ctx.reply('Сцена закрыта');
      }
      if (data === 'nextStep') {
        console.log('dddddddddddddd');
        await this.goToStepNext(ctx);
        return;
      }
    }

    // Если пользователь ввёл текст → сохраняем
    if (ctx.message && 'text' in ctx.message) {
      ctx.scene.state['marka'] = ctx.message.text;
      // ctx.wizard.selectStep(1);
      // ctx.wizard.next();
      // await this.step2(ctx);
      await this.goToStepNext(ctx);
      return;
    }

    // Формируем сообщение
    const data = existData(ctx.scene.state['marka']);
    const text = `<b>Марка авто</b>\nПример: Geely${data}`;

    const keyboard = [[{ text: 'Отмена', callback_data: 'leaveScene' }]];
    if (data) {
      keyboard[0].push({ text: 'Далее', callback_data: 'nextStep' });
    }

    await this.botMessage.sendMessageToUser(
      ctx.user,
      ctx.app,
      text,
      keyboard,
      [],
    );
    // ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Ctx() ctx: MyWizardContext) {
    console.log('ffff', ctx.scene.state['marka']);
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const data = ctx.callbackQuery.data;

      if (data === 'leaveScene') {
        await ctx.scene.leave();
        return;
      }
      if (data === 'backStep') {
        await this.goToStepBack(ctx);
        return;
      }
      if (data === 'nextStep') {
        await this.goToStepNext(ctx);
        return;
      }
    }

    if (ctx.message && 'text' in ctx.message) {
      ctx.scene.state['model'] = ctx.message.text;
      // return ctx.wizard.next();
    }

    const data = existData(ctx.scene.state['model']);
    const text = `<b>Модель авто</b>\nПример: Coolray${data}`;

    const keyboard = [
      [
        { text: 'Назад', callback_data: 'backStep' },
        { text: 'Отмена', callback_data: 'leaveScene' },
      ],
    ];

    if (data) {
      keyboard[0].push({ text: 'Далее', callback_data: 'nextStep' });
    }

    // await ctx.reply('fdfdfd');

    await this.botMessage.sendMessageToUser(
      ctx.user,
      ctx.app,
      text,
      keyboard,
      [],
    );
  }

  // @WizardStep(3)
  // async step3(@Ctx() ctx: MyWizardContext) {
  //   if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
  //     const data = ctx.callbackQuery.data;

  //     if (data === 'leaveScene') {
  //       await ctx.scene.leave();
  //       return;
  //     }
  //     if (data === 'backStep') {
  //       ctx.wizard.selectStep(1);
  //       return this.step1(ctx);
  //     }
  //   }

  //   if (ctx.message && 'text' in ctx.message) {
  //     ctx.scene.state['model'] = ctx.message.text;
  //   }

  //   const data = existData(ctx.scene.state['age']);
  //   const text = `<b>Возраст авто</b>\nПример: 2021${data}`;

  //   const keyboard = [
  //     [
  //       { text: 'Назад', callback_data: 'backStep' },
  //       { text: 'Отмена', callback_data: 'leaveScene' },
  //     ],
  //   ];

  //   // Если ответ уже есть → показываем кнопку "Завершить"
  //   if (data) {
  //     keyboard[0].push({ text: 'Завершить', callback_data: 'finish' });
  //   }

  //   // Если нажали завершение
  //   if (ctx.callbackQuery && ctx.callbackQuery['data'] === 'finish') {
  //     await ctx.reply(
  //       `✅ Данные сохранены!\nМарка: ${ctx.scene.state['marka']}\nМодель: ${ctx.scene.state['marka']}\nВозраст: ${ctx.scene.state['age']}`,
  //     );
  //     await ctx.scene.leave();
  //     return;
  //   }

  //   await this.botMessage.sendMessageToUser(
  //     ctx.user,
  //     ctx.app,
  //     text,
  //     keyboard,
  //     [],
  //   );
  // }
}

// import { Injectable } from '@nestjs/common';
// import { Wizard, WizardStep, Ctx } from 'nestjs-telegraf';
// import { Context, Scenes } from 'telegraf';
// import { BotMessage } from '../bot.message';
// import { UserDocument } from 'src/user/user.schema';
// import { AppDocument } from 'src/app/app.schema';

// const existData = (data: any) => {
//   if (!data) return '';
//   return 'Ваш выбор: ' + data;
// };

// export interface AddCarWizardState extends Scenes.WizardSessionData {
//   marka?: string;
//   model?: string;
//   age?: string;
//   info?: string;
// }
// export interface MyWizardContext
//   extends Context,
//     Scenes.WizardContext<AddCarWizardState> {
//   user: UserDocument;
//   app: AppDocument;
// }

// @Injectable()
// @Wizard('addNewCar')
// export class AddNewCarScene {
//   constructor(private botMessage: BotMessage) {}
//   @WizardStep(1)
//   async step1(@Ctx() ctx: MyWizardContext) {
//     const data = existData(ctx.scene.state['marka']);
//     const text = `<b>Марка авто</b>\nПример: Geely\n` + data;
//     const keyboard = [[{ text: 'Отмена', callback_data: 'leaveScene' }]];
//     if (data) {
//       keyboard[keyboard.length - 1].push({
//         text: 'Далее',
//         callback_data: 'nextStep',
//       });
//     }
//     const media = [];
//     await this.botMessage.sendMessageToUser(
//       ctx.user,
//       ctx.app,
//       text,
//       keyboard,
//       media,
//     );
//     console.log(ctx.scene.session);
//     ctx.wizard.next();
//   }

//   @WizardStep(2)
//   async step2(@Ctx() ctx: MyWizardContext) {
//     if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
//       const data = ctx.callbackQuery.data;
//       if (data === 'nextStep') ctx.wizard.next();
//       else if (data === 'leaveScene') await ctx.scene.leave();
//       return;
//     }
//     if (!ctx.message || !('text' in ctx.message)) {
//       await ctx.reply('Пожалуйста, отправь текстовое сообщение.');
//       return;
//     }
//     const model = ctx.message.text;
//     ctx.scene.state['model'] = model;

//     const data = existData(ctx.scene.state['model']);
//     const text = `<b>Модель авто</b>\nПример: Coolray\n` + data;
//     const keyboard = [
//       [
//         { text: 'Назад', callback_data: 'backStep' },
//         { text: 'Отмена', callback_data: 'leaveScene' },
//       ],
//     ];
//     if (data) {
//       keyboard[keyboard.length - 1].push({
//         text: 'Далее',
//         callback_data: 'nextStep',
//       });
//     }
//     const media = [];
//     await this.botMessage.sendMessageToUser(
//       ctx.user,
//       ctx.app,
//       text,
//       keyboard,
//       media,
//     );
//     ctx.wizard.next();
//   }

//   @WizardStep(3)
//   async step3(@Ctx() ctx: MyWizardContext) {
//     if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
//       const data = ctx.callbackQuery.data;
//       if (data === 'nextStep') ctx.wizard.next();
//       else if (data === 'backStep') await ctx.scene.reenter();
//       else if (data === 'leaveScene') await ctx.scene.leave();
//       return;
//     }
//     if (!ctx.message || !('text' in ctx.message)) {
//       await ctx.reply('Пожалуйста, отправь текстовое сообщение.');
//       return;
//     }

//     const age = ctx.message.text;
//     ctx.scene.state['age'] = age;

//     await ctx.reply(
//       `Отлично, ${ctx.scene.state['name']}! Тебе ${age} лет. Спасибо за информацию 🙂`,
//     );
//     await ctx.scene.leave();
//   }
// }
