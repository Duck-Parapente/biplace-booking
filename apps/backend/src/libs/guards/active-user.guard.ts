import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticatedUser } from './jwt.strategy';

@Injectable()
export class ActiveUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      throw new UnauthorizedException({ label: 'Utilisateur non authentifié.', message: 'User not authenticated' });
    }

    if (!user.isActive) {
      throw new UnauthorizedException({ label: 'Ton compte n\'est pas actif.', message: 'User account is not active' });
    }

    return true;
  }
}
