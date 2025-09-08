import { Update, Command, Ctx, Action } from 'nestjs-telegraf';
import { AppService } from 'src/app/app.service';
import { ContextWithUserApp } from './interfaces/contexUserApp';
import { Injectable, UseGuards } from '@nestjs/common';
import { RoleGuard } from './guards/access-control.guard';
import { SetMetadata } from '@nestjs/common';
import { BotService } from './bot.service';
import { MyWizardContext } from './scenes/addNewCar.scene';
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

  @Action('addNewCar')
  async wizard(@Ctx() ctx: MyWizardContext) {
    await ctx.scene.enter('addNewCar');
    await ctx.answerCbQuery();
  }

  @UseGuards(RoleGuard)
  @Roles()
  @Command('start')
  async start(@Ctx() ctx: ContextWithUserApp) {
    await this.botService.start(ctx.user, ctx.app);
  }

  @UseGuards(RoleGuard)
  @Roles('superadmin')
  @Command('enter')
  async getAuthLink(@Ctx() ctx: ContextWithUserApp) {
    await ctx.reply(this.appService.getAuthLink(ctx.from!.id)).catch((e) => {
      console.log(e);
    });
  }
}
