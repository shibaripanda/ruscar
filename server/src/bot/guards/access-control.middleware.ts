import { MiddlewareFn } from 'telegraf';
import { ModuleRef } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { AppService } from 'src/app/app.service';
import { ContextWithUserApp } from '../interfaces/contexUserApp';
import { UserDocument } from 'src/user/user.schema';
import { AppDocument } from 'src/app/app.schema';

export const accessControlMiddleware = (): MiddlewareFn<ContextWithUserApp> => {
  return async (ctx, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const moduleRef: ModuleRef = ctx.state.moduleRef;

    const from = ctx.from;

    if (ctx.chat?.type !== 'private' || ctx.from?.is_bot || !from) {
      console.log('не пройден мидлвар');
      return;
    }

    const userService = moduleRef.get(UserService, { strict: false });
    const user: UserDocument | null =
      await userService.createOrUpdateUser(from);
    const appService = moduleRef.get(AppService, { strict: false });
    const app: AppDocument | null = await appService.getAppSettings();

    if (!user || !app) return;

    ctx.user = user;
    ctx.app = app;

    await next();
  };
};
