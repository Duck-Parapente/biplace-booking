import { Module } from '@nestjs/common';

import { CreatePackHttpController } from './commands/create-pack.http.controller';
import { CreatePackService } from './commands/create-pack.service';
import { PACK_REPOSITORY } from './pack.di-tokens';
import { PackRepository } from './providers/database/pack.repository';

@Module({
  imports: [],
  controllers: [CreatePackHttpController],
  providers: [CreatePackService, { provide: PACK_REPOSITORY, useClass: PackRepository }],
})
export class PackModule {}
