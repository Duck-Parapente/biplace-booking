import { Email } from '@libs/ddd';

export interface ExternalUser {
  externalAuthId: string;
  email: Email;
}

// Consolidated profile fields to avoid repetition across commands/events/types
export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UserProps extends UserProfile {
  email: Email;
  externalAuthId: string;
  currentScore: number;
}

export type CreateUserProps = ExternalUser;
export type UpdateUserProps = UserProfile;
