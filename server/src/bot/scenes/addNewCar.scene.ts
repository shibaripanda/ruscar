import { Injectable } from '@nestjs/common';
import { Wizard, WizardStep, Ctx } from 'nestjs-telegraf';
import { Context, Scenes } from 'telegraf';
import { BotMessage } from '../bot.message';
import { UserDocument } from 'src/user/user.schema';
import { AppDocument } from 'src/app/app.schema';

export interface AddCarWizardState extends Scenes.WizardSessionData {
  name?: string;
  age?: string;
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
  @WizardStep(1)
  async step1(@Ctx() ctx: MyWizardContext) {
    await this.botMessage.sendMessageToUser(
      ctx.user,
      ctx.app,
      'Привет! Как тебя зовут?',
    );
    await ctx.reply('Привет! Как тебя зовут?');
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(@Ctx() ctx: MyWizardContext) {
    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply('Пожалуйста, отправь текстовое сообщение.');
      return;
    }
    const name = ctx.message.text;
    ctx.scene.state['name'] = name;
    await ctx.reply(`Приятно познакомиться, ${name}! Сколько тебе лет?`);
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(@Ctx() ctx: MyWizardContext) {
    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply('Пожалуйста, отправь текстовое сообщение.');
      return;
    }

    const age = ctx.message.text;
    ctx.scene.state['age'] = age;

    await ctx.reply(
      `Отлично, ${ctx.scene.state['name']}! Тебе ${age} лет. Спасибо за информацию 🙂`,
    );
    await ctx.scene.leave();
  }
}
