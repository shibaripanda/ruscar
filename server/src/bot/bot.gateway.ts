import { Update, Command, Ctx, Action, On } from 'nestjs-telegraf';
import { AppService } from 'src/app/app.service';
import {
  ContextWithUserApp,
  MyWizardContext,
} from './interfaces/contexUserApp';
import { Injectable, UseGuards } from '@nestjs/common';
import { RoleGuard } from './guards/access-control.guard';
import { SetMetadata } from '@nestjs/common';
import { BotService } from './bot.service';
import { Message } from '@telegraf/types';
import { CarService } from 'src/car/car.service';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Update()
@Injectable()
export class BotGateway {
  constructor(
    private botService: BotService,
    private carService: CarService,
  ) {
    console.log('BotGateway initialized');
  }

  @UseGuards(RoleGuard)
  @Roles()
  @Action('myCars')
  async myCars(@Ctx() ctx: ContextWithUserApp) {
    await this.botService.myCars(ctx.user, ctx.app);
  }

  @Action('addcar')
  async wizardTest(@Ctx() ctx: MyWizardContext) {
    await ctx.scene.enter('addcar');
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
  @Action(/editCar\|(.+)/)
  async editCar(@Ctx() ctx: MyWizardContext) {
    const [, _id]: [string, string] = ctx.match as unknown as [string, string];
    const car = await this.carService.getCar(_id);
    if (car) await ctx.scene.enter('addcar', car.toObject());
    await ctx.answerCbQuery();
  }

  @UseGuards(RoleGuard)
  @Roles()
  @Action(/deleteCar\|(.+)/)
  async deleteCar(@Ctx() ctx: ContextWithUserApp) {
    const [, _id]: [string, string] = ctx.match as unknown as [string, string];
    await this.botService.deleteCar(ctx.user, ctx.app, _id);
    await ctx.answerCbQuery();
  }

  @UseGuards(RoleGuard)
  @Roles()
  @Action(/car\|(.+)/)
  async car(@Ctx() ctx: ContextWithUserApp) {
    const [, _id]: [string, string] = ctx.match as unknown as [string, string];
    await this.botService.showCar(ctx.user, ctx.app, _id);
    await ctx.answerCbQuery();
  }

  @UseGuards(RoleGuard)
  @Roles()
  @Action('startScreen')
  async startScreen(@Ctx() ctx: ContextWithUserApp) {
    await this.botService.start(ctx.user, ctx.app);
    await ctx.answerCbQuery();
  }

  @UseGuards(RoleGuard)
  @Roles()
  @Command('start')
  async start(@Ctx() ctx: ContextWithUserApp) {
    console.log('start');
    await this.botService.start(ctx.user, ctx.app);
    await ctx.deleteMessage();
  }

  @UseGuards(RoleGuard)
  @Roles('superadmin', 'admin')
  @Command('enter')
  async getAuthLink(@Ctx() ctx: ContextWithUserApp) {
    await this.botService.getAuthLink(ctx.user, ctx.app);
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
