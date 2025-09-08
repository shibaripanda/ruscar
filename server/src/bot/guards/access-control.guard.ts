import { Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextWithUserApp } from '../interfaces/contexUserApp';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContextWithUserApp): boolean {
    // Получаем роли из метаданных контроллера/метода
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true; // Если роли не заданы — доступ открыт
    }
    const role = context.user.role;

    return roles.includes(role);
  }
}
