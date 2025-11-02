import { ExternalUser } from '../domain/user.types';

export interface IdentityProviderPort {
  getExternalUserById(externalAuthId: string): Promise<ExternalUser | null>; //Deprecated for now
}
