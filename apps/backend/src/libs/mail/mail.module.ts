import { Global, Module } from '@nestjs/common';

import { MailClient } from './mail.client';

@Global()
@Module({
  imports: [],
  providers: [MailClient],
  exports: [MailClient],
})
export class MailModule {}
