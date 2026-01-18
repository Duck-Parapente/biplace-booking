import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticatedUser } from './jwt.strategy';

@Injectable()
export class ActiveUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is not active');
    }

    return true;
  }
}
