// auth/jwt.strategy.ts
import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DUCK_ROLES_CLAIM, UserRoles } from 'shared';

export interface JwtPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  iat?: number;
  exp?: number;
  [DUCK_ROLES_CLAIM]?: UserRoles[];
}

export interface AuthenticatedUser {
  id: UUID;
  roles: UserRoles[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const domain = configService.get<string>('AUTH0_DOMAIN');
    const audience = configService.get<string>('AUTH0_AUDIENCE');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    this.logger.warn('Validating JWT payload');
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await prisma.user.findUnique({
      where: { externalAuthId: payload.sub },
    });

    this.logger.warn(`User found: ${user?.id ?? 'none'}`);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: new UUID({ uuid: user.id }), roles: payload[DUCK_ROLES_CLAIM] };
  }
}
