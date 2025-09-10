import { Update, Command, Ctx, Action, On } from 'nestjs-telegraf';
import { AppService } from 'src/app/app.service';
import { ContextWithUserApp } from './interfaces/contexUserApp';
import { Injectable, UseGuards } from '@nestjs/common';
import { RoleGuard } from './guards/access-control.guard';
import { SetMetadata } from '@nestjs/common';
import { BotService } from './bot.service';
import { MyWizardContext } from './scenes/addNewCar.scene';
import { Message } from '@telegraf/types';
// import { addNewCarScene, MyWizardContext } from './scenes/addNewCar.scene';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Update()
@Injectable()
export class BotGateway {
  constructor(
    private appService: AppService,
    private botService: BotService,
  ) {
    console.log('BotGateway initialized');
  }

  @Action('test')
  async wizardTest(@Ctx() ctx: MyWizardContext) {
    await ctx.scene.enter('test');
    await ctx.answerCbQuery();
  }

  @Action('addNewCar')
  async wizard(@Ctx() ctx: MyWizardContext) {
    await ctx.scene.enter('addNewCar');
    await ctx.answerCbQuery();
  }

  @UseGuards(RoleGuard)
  @Roles()
  @Action('leaveScene')
  async leaveScene(@Ctx() ctx: ContextWithUserApp) {
    await this.botService.start(ctx.user, ctx.app);
  }

  @UseGuards(RoleGuard)
  @Roles()
  @Command('start')
  async start(@Ctx() ctx: ContextWithUserApp) {
    await this.botService.start(ctx.user, ctx.app);
    await ctx.deleteMessage();
  }

  @UseGuards(RoleGuard)
  @Roles('superadmin')
  @Command('enter')
  async getAuthLink(@Ctx() ctx: ContextWithUserApp) {
    await ctx.reply(this.appService.getAuthLink(ctx.from!.id)).catch((e) => {
      console.log(e);
    });
    await ctx.deleteMessage();
  }

  @On('photo')
  async photoGetting(@Ctx() ctx: ContextWithUserApp) {
    console.log(ctx.message);
    const message = ctx.message as Message.PhotoMessage;
    const photos = message.photo;
    const highestQualityPhoto = photos[photos.length - 1];
    const fileId = highestQualityPhoto.file_id;
    if (message.caption) {
      if (message.caption === 'fish') {
        ctx.app.placeholderImage = fileId;
        await ctx.app.save();
      }
    }
    await ctx.deleteMessage();
  }

  @On('message')
  async text(@Ctx() ctx: ContextWithUserApp) {
    await ctx.deleteMessage();
  }
}
