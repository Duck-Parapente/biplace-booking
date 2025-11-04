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
  currentScore?: number;
  createdAt?: Date;
}

export interface CreateUserProps {
  email: Email;
  externalAuthId: string;
}

// Updating user only touches profile fields for now
export type UpdateUserProps = UserProfile;
