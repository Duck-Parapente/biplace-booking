import { Email } from '@libs/ddd/email.value-object';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';

import { IdentityProviderPort } from '../domain/ports/identity.provider.port';
import { ExternalUser } from '../domain/user.types';

@Injectable()
export class IdentityProvider implements IdentityProviderPort {
  private readonly logger = new Logger(IdentityProvider.name);
  private managementClient: ManagementClient;

  constructor(private configService: ConfigService) {
    this.managementClient = new ManagementClient({
      domain: this.configService.get<string>('AUTH0_DOMAIN'),
      clientId: this.configService.get<string>('AUTH0_CLIENT_ID'),
      clientSecret: this.configService.get<string>('AUTH0_CLIENT_SECRET'),
    });
  }

  async getExternalUserById(externalAuthId: string): Promise<ExternalUser | null> {
    try {
      const user = await this.managementClient.users.get(externalAuthId);

      if (!user.email) {
        return null;
      }

      return {
        externalAuthId: user.user_id,
        email: new Email({ email: user.email }),
      };
    } catch (error) {
      this.logger.error(`Failed to fetch user from Auth0: ${error}`);
      return null;
    }
  }
}
