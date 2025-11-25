import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { FeatureFlagModule } from '@modules/feature-flag/feature-flag.module';
import { Module } from '@nestjs/common';

import { CreateReservationWishHttpController } from './commands/create-reservation-wish.http.controller';
import { CreateReservationWishService } from './commands/create-reservation-wish.service';
import { CreateReservationsService } from './commands/create-reservation.service';
import { GetReservationWishesHttpController } from './commands/get-reservation-wishes.http.controller';
import { GetReservationWishesService } from './commands/get-reservation-wishes.service';
import { UpdateReservationWishHttpController } from './commands/update-reservation-wish.http.controller';
import { UpdateReservationWishService } from './commands/update-reservation-wish.service';
import { ReservationWishDomainService } from './domain/reservation-wish.domain-service';
import { ReservationDomainService } from './domain/reservation.domain-service';
import { ReservationWishRepository } from './providers/reservation-wish.repository';
import { ReservationRepository } from './providers/reservation.repository';
import { RESERVATION_REPOSITORY, RESERVATION_WISH_REPOSITORY } from './reservation.di-tokens';

@Module({
  imports: [FeatureFlagModule],
  controllers: [
    CreateReservationWishHttpController,
    UpdateReservationWishHttpController,
    GetReservationWishesHttpController,
  ],
  providers: [
    CreateReservationWishService,
    UpdateReservationWishService,
    GetReservationWishesService,
    GetReservationWishesService,
    CreateReservationsService,
    ReservationWishDomainService,
    ReservationDomainService,
    { provide: RESERVATION_WISH_REPOSITORY, useClass: ReservationWishRepository },
    { provide: RESERVATION_REPOSITORY, useClass: ReservationRepository },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
  exports: [GetReservationWishesService, UpdateReservationWishService, CreateReservationsService],
})
export class ReservationModule {}
