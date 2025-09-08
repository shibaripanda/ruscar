import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { TelegrafModule } from 'nestjs-telegraf';
import { accessControlMiddleware } from './guards/access-control.middleware';
import { UserModule } from 'src/user/user.module';
import { BotMessage } from './bot.message';
import { BotService } from './bot.service';
import { BotGateway } from './bot.gateway';
import { ScenesModule } from 'src/scenes-module/scenes-module.module';
import { session } from 'telegraf';

@Global()
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [UserModule],
      inject: [ConfigService, ModuleRef],
      useFactory: (config: ConfigService, moduleRef: ModuleRef) => ({
        token: config.get<string>('BOT_TOKEN')!,
        dropPendingUpdates: true,
        middlewares: [
          (ctx, next) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ctx.state.moduleRef = moduleRef;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return accessControlMiddleware()(ctx, next);
          },
          session(),
        ],
      }),
    }),
    ScenesModule,
  ],
  providers: [BotMessage, BotService, BotGateway],
  exports: [],
})
export class BotModule {}
