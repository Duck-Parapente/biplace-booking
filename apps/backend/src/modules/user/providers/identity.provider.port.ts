export interface ExternalUser {
  externalAuthId: string;
  email: string;
}

export interface IdentityProviderPort {
  getExternalUserById(externalUserId: string): Promise<ExternalUser | null>;
}
