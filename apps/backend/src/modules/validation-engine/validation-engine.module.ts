import { Module } from '@nestjs/common';

import { AttibutePackCliController } from './commands/attribute-packs.cli.controller';
import { AttributionDomainService } from './domain/attibution.domain-service';
import { AttributePacksDomainService } from './domain/attribute-packs.domain-service';
import { PackRepository } from './providers/pack.repository.port';
import { ReservationWishRepository } from './providers/reservation-wish.repository.port';
import { PACK_REPOSITORY, RESERVATION_WISH_REPOSITORY } from './validation-engine.di-tokens';

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: PACK_REPOSITORY, useClass: PackRepository },
    { provide: RESERVATION_WISH_REPOSITORY, useClass: ReservationWishRepository },
    AttibutePackCliController,
    AttributionDomainService,
    AttributePacksDomainService,
  ],
})
export class ValidationEngineModule {}
