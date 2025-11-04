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
  phoneNumber?: string;
  address?: string;
  currentScore?: number;
  createdAt?: Date;
}

export interface CreateUserProps {
  email: Email;
  externalAuthId: string;
}

export interface UpdateUserProps {
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
}
