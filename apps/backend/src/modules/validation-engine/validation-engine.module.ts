import { PackModule } from '@modules/pack/pack.module';
import { ReservationModule } from '@modules/reservation/reservation.module';
import { Module } from '@nestjs/common';

import { AttibutePackCliController } from './commands/attribute-packs.cli.controller';
import { AttributionDomainService } from './domain/attibution.domain-service';
import { AttributePacksDomainService } from './domain/attribute-packs.domain-service';
import { PackRepository } from './providers/pack.repository';
import { ReservationWishRepository } from './providers/reservation-wish.repository';
import { ReservationRepository } from './providers/reservation.repository';
import {
  PACK_REPOSITORY,
  RESERVATION_REPOSITORY,
  RESERVATION_WISH_REPOSITORY,
} from './validation-engine.di-tokens';

@Module({
  imports: [PackModule, ReservationModule],
  controllers: [],
  providers: [
    { provide: PACK_REPOSITORY, useClass: PackRepository },
    { provide: RESERVATION_WISH_REPOSITORY, useClass: ReservationWishRepository },
    { provide: RESERVATION_REPOSITORY, useClass: ReservationRepository },
    AttibutePackCliController,
    AttributionDomainService,
    AttributePacksDomainService,
  ],
})
export class ValidationEngineModule {}
