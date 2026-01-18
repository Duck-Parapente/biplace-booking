import { Email } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';

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
  currentScore: Integer;
  isActive: boolean;
  activeUntil: DateValueObject | null;
}

export type CreateUserProps = ExternalUser;
export type UpdateUserProps = UserProfile;
