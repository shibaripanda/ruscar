import { ExecutionContext } from '@nestjs/common';
import { AppDocument } from 'src/app/app.schema';
import { UserDocument } from 'src/user/user.schema';
import { Context } from 'telegraf';

export interface ContextWithUserApp extends Context {
  user: UserDocument;
  app: AppDocument;
}

export interface ExecutionContextWithUserApp extends ExecutionContext {
  user: UserDocument;
  app: AppDocument;
}
