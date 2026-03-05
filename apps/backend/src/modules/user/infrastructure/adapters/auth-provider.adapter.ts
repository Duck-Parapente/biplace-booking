import { envKeys } from '@libs/config/env.constants';
import { Email } from '@libs/ddd';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';

import { AuthProviderPort } from '../../domain/ports/auth-provider.port';

const USER_ROLE_ID = 'rol_KNl56Wx35gvKqHyL';

@Injectable()
export class AuthProviderAdapter implements AuthProviderPort {
  private readonly logger = new Logger(AuthProviderAdapter.name);
  private managementClient: ManagementClient;

  constructor(private readonly configService: ConfigService) {
    const domain = this.configService.getOrThrow<string>(envKeys.auth0Domain);
    const clientId = this.configService.getOrThrow<string>(envKeys.auth0ManagementClientId);
    const clientSecret = this.configService.getOrThrow<string>(envKeys.auth0ManagementClientSecret);

    this.managementClient = new ManagementClient({
      domain,
      clientId,
      clientSecret,
    });
  }

  async findOrCreate(email: Email): Promise<string> {
    try {
      const existing = await this.findByEmail(email.email);
      if (existing) {
        return existing;
      }

      const userId = await this.createUser(email.email);
      await this.assignRoleToUser(userId);
      return userId;
    } catch (error) {
      this.logger.error(`Failed to findOrCreate user in Auth0: ${error}`);
      throw error;
    }
  }

  private async findByEmail(email: string): Promise<string | null> {
    try {
      const users = await this.managementClient.users.list({
        q: `email:\"${email}\"`,
        search_engine: 'v3',
      });

      if (users.data && users.data.length > 0) {
        this.logger.log(`Found existing Auth0 user for email: ${email}`);
        return users.data[0].user_id!;
      }
      return null;
    } catch (error) {
      this.logger.warn(`Error searching for user by email: ${error}`);
      return null;
    }
  }

  private async createUser(email: string): Promise<string> {
    this.logger.log(`Creating new Auth0 user for email: ${email}`);
    const newUser = await this.managementClient.users.create({
      email,
      password: this.generateTemporaryPassword(),
      connection: 'Username-Password-Authentication',
      email_verified: false,
    });
    return newUser.user_id!;
  }

  private async assignRoleToUser(userId: string): Promise<void> {
    await this.managementClient.roles.users.assign(USER_ROLE_ID, { users: [userId] });
    this.logger.log(`Assigned role to Auth0 user ${userId}`);
  }

  private generateTemporaryPassword(): string {
    return Math.random().toString(36).slice(-8) + 'Aa1!';
  }
}
