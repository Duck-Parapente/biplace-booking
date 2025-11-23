import { Module } from '@nestjs/common';

import { AttibutePackCliController } from './commands/attribute-packs.cli.controller';
import { AttributionDomainService } from './domain/attibution.domain-service';
import { AttributePacksDomainService } from './domain/attribute-packs.domain-service';

@Module({
  imports: [],
  controllers: [],
  providers: [AttibutePackCliController, AttributionDomainService, AttributePacksDomainService],
})
export class ValidationEngineModule {}
