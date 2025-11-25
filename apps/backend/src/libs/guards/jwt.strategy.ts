import https from 'https';

import { envKeys } from '@libs/config/env.constants';
import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DUCK_ROLES_CLAIM, UserRoles } from 'shared';

const requestAgent = new https.Agent({
  keepAlive: false,
});

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
  constructor(private readonly configService: ConfigService) {
    const domain = configService.getOrThrow<string>(envKeys.auth0Domain);
    const audience = configService.getOrThrow<string>(envKeys.auth0Audience);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        cacheMaxAge: 12 * 60 * 60 * 1000, // 12 hours
        rateLimit: false,
        timeout: 2000,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
        requestAgent,
      }),
      audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await prisma.user.findUnique({
      where: { externalAuthId: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: new UUID({ uuid: user.id }), roles: payload[DUCK_ROLES_CLAIM] };
  }
}
