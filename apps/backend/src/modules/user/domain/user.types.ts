import { Email } from '@libs/ddd/email.value-object';

export interface ExternalUser {
  externalAuthId: string;
  email: Email;
}
