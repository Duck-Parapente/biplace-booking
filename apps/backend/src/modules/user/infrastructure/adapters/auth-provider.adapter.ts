import { Injectable } from '@nestjs/common';

import { AuthProviderPort } from '../../domain/ports/auth-provider.port';
import { Email } from '@libs/ddd';

@Injectable()
export class AuthProviderAdapter implements AuthProviderPort {
  async findOrCreate(email: Email): Promise<string> {
    // Implementation returning a fake external auth ID
    return `fake-auth-id-${email.email.replace('@', '-at-')}`;
  }
}
