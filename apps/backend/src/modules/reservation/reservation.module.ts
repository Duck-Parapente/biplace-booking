import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { Module } from '@nestjs/common';

import { PackModule } from '../pack/pack.module';

import { CreateReservationWishHttpController } from './commands/create-reservation-wish.http.controller';
import { CreateReservationWishService } from './commands/create-reservation-wish.service';
import { CreateReservationsService } from './commands/create-reservation.service';
import { GetPlanningHttpController } from './commands/get-planning.http.controller';
import { GetPlanningService } from './commands/get-planning.service';
import { GetReservationWishesHttpController } from './commands/get-reservation-wishes.http.controller';
import { GetReservationWishesService } from './commands/get-reservation-wishes.service';
import { UpdateReservationWishHttpController } from './commands/update-reservation-wish.http.controller';
import { UpdateReservationWishService } from './commands/update-reservation-wish.service';
import { PlanningDomainService } from './domain/planning.domain-service';
import { ReservationWishDomainService } from './domain/reservation-wish.domain-service';
import { ReservationDomainService } from './domain/reservation.domain-service';
import { EmailNotificationAdapter } from './providers/email-notification.adapter';
import { ReservationWishRepository } from './providers/reservation-wish.repository';
import { ReservationRepository } from './providers/reservation.repository';
import {
  RESERVATION_REPOSITORY,
  RESERVATION_WISH_NOTIFICATION_PORT,
  RESERVATION_WISH_REPOSITORY,
} from './reservation.di-tokens';

@Module({
  imports: [PackModule],
  controllers: [
    CreateReservationWishHttpController,
    UpdateReservationWishHttpController,
    GetReservationWishesHttpController,
    GetPlanningHttpController,
  ],
  providers: [
    CreateReservationWishService,
    UpdateReservationWishService,
    GetReservationWishesService,
    GetReservationWishesService,
    GetPlanningService,
    CreateReservationsService,
    ReservationWishDomainService,
    ReservationDomainService,
    PlanningDomainService,
    { provide: RESERVATION_WISH_REPOSITORY, useClass: ReservationWishRepository },
    { provide: RESERVATION_REPOSITORY, useClass: ReservationRepository },
    {
      provide: RESERVATION_WISH_NOTIFICATION_PORT,
      useClass: EmailNotificationAdapter,
    },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
  exports: [GetReservationWishesService, UpdateReservationWishService, CreateReservationsService],
})
export class ReservationModule {}
