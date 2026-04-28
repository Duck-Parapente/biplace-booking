import { Email } from '@libs/ddd';

export interface AuthProviderPort {
  findOrCreate(email: Email): Promise<string>;
}
