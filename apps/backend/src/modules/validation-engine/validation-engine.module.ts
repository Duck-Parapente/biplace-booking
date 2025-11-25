import { FeatureFlagModule } from '@modules/feature-flag/feature-flag.module';
import { PackModule } from '@modules/pack/pack.module';
import { ReservationModule } from '@modules/reservation/reservation.module';
import { Module } from '@nestjs/common';

import { AttibutePackCliController } from './commands/attribute-packs.cli.controller';
import { AttributePacksService } from './commands/attribute-packs.service';
import { AttributionDomainService } from './domain/attribution.domain-service';

@Module({
  imports: [PackModule, ReservationModule, FeatureFlagModule],
  controllers: [],
  providers: [AttibutePackCliController, AttributionDomainService, AttributePacksService],
})
export class ValidationEngineModule {}
