import { ExternalUser } from '../domain/user.types';

export interface IdentityProviderPort {
  getExternalUserById(externalUserId: string): Promise<ExternalUser | null>;
}
