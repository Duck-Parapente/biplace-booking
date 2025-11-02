import { Email } from '@libs/ddd';

export interface ExternalUser {
  externalAuthId: string;
  email: Email;
}

export interface UserProps {
  email: Email;
  externalAuthId: string;
  firstName?: string;
  lastName?: string;
  address?: string;
}

export interface CreateUserProps {
  email: Email;
  externalAuthId: string;
}
