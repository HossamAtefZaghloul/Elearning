import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../Decorator/roles.decorator';
import { UserRole } from 'src/database/core/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest(); // user already gets extracted using auth guard at first so ensure this first

    return requiredRoles.includes(user.role);
  }
}
