import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedSocket } from '../interfaces/authenticatedSocket';

@Injectable()
export class RoleGuardSocket implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const client: AuthenticatedSocket = context.switchToWs().getClient();

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }

    const role = client.data.user.role;
    return roles.includes(role);
  }
}