import { EventEmitter } from '@libs/events/database/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { Module } from '@nestjs/common';

import { CreateReservationWishHttpController } from './commands/create-reservation-wish.http.controller';
import { CreateReservationWishService } from './commands/create-reservation-wish.service';
import { ReservationWishRepository } from './providers/database/reservation-wish.repository';
import { RESERVATION_WISH_REPOSITORY } from './reservation.di-tokens';

@Module({
  imports: [],
  controllers: [CreateReservationWishHttpController],
  providers: [
    CreateReservationWishService,
    { provide: RESERVATION_WISH_REPOSITORY, useClass: ReservationWishRepository },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
})
export class ReservationModule {}
