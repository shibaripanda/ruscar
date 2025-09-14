import { ExecutionContext } from '@nestjs/common';
import { AppDocument } from 'src/app/app.schema';
import { UserDocument } from 'src/user/user.schema';
import { Context, Scenes } from 'telegraf';
import { AddCarWizardState } from '../scenes/addcar.scene';

export interface ContextWithUserApp extends Context {
  user: UserDocument;
  app: AppDocument;
  match?: RegExpMatchArray;
}

export interface ExecutionContextWithUserApp extends ExecutionContext {
  user: UserDocument;
  app: AppDocument;
}

export interface MyWizardContext
  extends Context,
    Scenes.WizardContext<AddCarWizardState> {
  user: UserDocument;
  app: AppDocument;
  match?: RegExpMatchArray;
}
