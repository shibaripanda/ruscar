import { Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ContextWithUserApp,
  ExecutionContextWithUserApp,
} from '../interfaces/contexUserApp';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContextWithUserApp): boolean {
    const telegrafCtx = TelegrafExecutionContext.create(context);
    const ctx: ContextWithUserApp = telegrafCtx.getContext();

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true; // Если роли не заданы — доступ открыт
    }
    const role = ctx.user.role;

    return roles.includes(role);
  }
}
