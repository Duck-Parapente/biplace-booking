import { Auth0Config, Auth0ConfigType } from '@config/auth0.config';
import { Email } from '@libs/ddd/email.value-object';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';

import { ExternalUser } from '../domain/user.types';

import { IdentityProviderPort } from './identity.provider.port';

@Injectable()
export class IdentityProvider implements IdentityProviderPort {
  private readonly logger = new Logger(IdentityProvider.name);
  private managementClient: ManagementClient;

  constructor(private configService: ConfigService) {
    const auth0 = this.configService.get<Auth0Config>(Auth0ConfigType)!;

    this.managementClient = new ManagementClient({
      domain: auth0.domain,
      clientId: auth0.clientId,
      clientSecret: auth0.clientSecret,
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
