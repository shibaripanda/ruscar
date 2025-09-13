import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { TelegrafModule } from 'nestjs-telegraf';
import { accessControlMiddleware } from './guards/access-control.middleware';
import { UserModule } from 'src/user/user.module';
import { BotMessage } from './bot.message';
import { BotService } from './bot.service';
import { BotGateway } from './bot.gateway';
import { session } from 'telegraf';
import { AddCar } from './scenes/addcar.scene';
import { CarModule } from 'src/car/car.module';

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
    CarModule,
  ],
  providers: [BotMessage, BotService, BotGateway, AddCar],
  exports: [],
})
export class BotModule {}
