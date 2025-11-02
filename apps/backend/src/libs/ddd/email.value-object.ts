import { Guard } from '@libs/guards/primitive.guard';

import { ArgumentInvalidException } from '../exceptions/exceptions';

import { ValueObject } from './value-object.base';

/** Note:
 * Value Objects with multiple properties can contain
 * other Value Objects inside if needed.
 * */

export interface EmailProps {
  email: string;
}

export class Email extends ValueObject<EmailProps> {
  get email(): string {
    return this.props.email;
  }

  protected validate({ email }: EmailProps): void {
    if (Guard.isEmpty(email)) throw new ArgumentInvalidException('Email cannot be empty');

    const normalized = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new ArgumentInvalidException(`Invalid email format: ${email}`);
    }
  }
}
