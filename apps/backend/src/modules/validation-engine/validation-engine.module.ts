import { Module } from '@nestjs/common';

import { AttibutePackCliController } from './commands/attribute-packs.cli.controller';
import { AttributionDomainService } from './domain/attibution.domain-service';
import { AttributePacksDomainService } from './domain/attribute-packs.domain-service';
import { PACK_REPOSITORY } from './validation-engine.di-tokens';
import { PackRepository } from './providers/pack.repository.port';

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: PACK_REPOSITORY, useClass: PackRepository },
    AttibutePackCliController,
    AttributionDomainService,
    AttributePacksDomainService,
  ],
})
export class ValidationEngineModule {}
