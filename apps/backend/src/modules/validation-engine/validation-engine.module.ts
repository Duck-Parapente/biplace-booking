import { Module } from '@nestjs/common';

import { AttibutePackCliController } from './commands/attribute-packs.cli.controller';
import { AttributionDomainService } from './domain/attibution.domain-service';

@Module({
  imports: [],
  controllers: [],
  providers: [AttibutePackCliController, AttributionDomainService],
})
export class ValidationEngineModule {}
