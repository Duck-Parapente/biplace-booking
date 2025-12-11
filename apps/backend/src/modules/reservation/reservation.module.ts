import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { Module } from '@nestjs/common';

import { PackModule } from '../pack/pack.module';

import { CancelReservationService } from './application/commands/cancel-reservation/cancel-reservation.service';
import { CloseReservationService } from './application/commands/close-reservation/close-reservation.service';
import { CreateReservationService } from './application/commands/create-reservation/create-reservation.service';
import { CreateReservationWishService } from './application/commands/create-reservation-wish/create-reservation-wish.service';
import { UpdateReservationService } from './application/commands/update-reservation/update-reservation.service';
import { UpdateReservationWishService } from './application/commands/update-reservation-wish/update-reservation-wish.service';
import { GetPackReservationsService } from './application/queries/get-pack-reservations/get-pack-reservations.service';
import { GetPlanningService } from './application/queries/get-planning/get-planning.service';
import { GetReservationsService } from './application/queries/get-reservation/get-reservation.service';
import { GetReservationWishesService } from './application/queries/get-reservation-wishes/get-reservation-wishes.service';
import { ReservationAuthorizationService } from './application/services/reservation-authorization.service';
import { PlanningDomainService } from './domain/planning.domain-service';
import { ReservationWishDomainService } from './domain/reservation-wish.domain-service';
import { ReservationDomainService } from './domain/reservation.domain-service';
import { ReservationEmailNotificationAdapter } from './infrastructure/adapters/reservation-email-notification.adapter';
import { ReservationWishEmailNotificationAdapter } from './infrastructure/adapters/reservation-wish-email-notification.adapter';
import { CancelReservationHttpController } from './infrastructure/http/controllers/cancel-reservation.http.controller';
import { CloseReservationHttpController } from './infrastructure/http/controllers/close-reservation.http.controller';
import { CreateReservationWishHttpController } from './infrastructure/http/controllers/create-reservation-wish.http.controller';
import { CreateReservationHttpController } from './infrastructure/http/controllers/create-reservation.http.controller';
import { GetPackReservationsHttpController } from './infrastructure/http/controllers/get-pack-reservations.http.controller';
import { GetPlanningHttpController } from './infrastructure/http/controllers/get-planning.http.controller';
import { GetReservationWishesHttpController } from './infrastructure/http/controllers/get-reservation-wishes.http.controller';
import { UpdateReservationWishHttpController } from './infrastructure/http/controllers/update-reservation-wish.http.controller';
import { UpdateReservationHttpController } from './infrastructure/http/controllers/update-reservation.http.controller';
import { ReservationCancelledEventHandler } from './infrastructure/listeners/reservation-cancelled.event-handler';
import { ReservationClosedEventHandler } from './infrastructure/listeners/reservation-closed.event-handler';
import { ReservationCreatedEventHandler } from './infrastructure/listeners/reservation-created.event-handler';
import { ReservationWishStatusUpdatedEventHandler } from './infrastructure/listeners/reservation-wish-updated.event-handler';
import { FlightLogRepository } from './infrastructure/persistence/flight-log.repository';
import { ReservationWishRepository } from './infrastructure/persistence/reservation-wish.repository';
import { ReservationRepository } from './infrastructure/persistence/reservation.repository';
import {
  FLIGHT_LOG_REPOSITORY,
  RESERVATION_NOTIFICATION_PORT,
  RESERVATION_REPOSITORY,
  RESERVATION_WISH_NOTIFICATION_PORT,
  RESERVATION_WISH_REPOSITORY,
} from './reservation.di-tokens';

@Module({
  imports: [PackModule],
  controllers: [
    CreateReservationHttpController,
    CreateReservationWishHttpController,
    UpdateReservationWishHttpController,
    UpdateReservationHttpController,
    GetReservationWishesHttpController,
    GetPlanningHttpController,
    GetPackReservationsHttpController,
    CancelReservationHttpController,
    CloseReservationHttpController,
  ],
  providers: [
    CreateReservationWishService,
    UpdateReservationWishService,
    UpdateReservationService,
    GetReservationWishesService,
    GetReservationsService,
    GetPlanningService,
    GetPackReservationsService,
    CreateReservationService,
    CancelReservationService,
    CloseReservationService,
    ReservationAuthorizationService,
    ReservationWishDomainService,
    ReservationDomainService,
    PlanningDomainService,
    ReservationWishStatusUpdatedEventHandler,
    ReservationCancelledEventHandler,
    ReservationCreatedEventHandler,
    ReservationClosedEventHandler,
    { provide: RESERVATION_WISH_REPOSITORY, useClass: ReservationWishRepository },
    { provide: RESERVATION_REPOSITORY, useClass: ReservationRepository },
    { provide: FLIGHT_LOG_REPOSITORY, useClass: FlightLogRepository },
    {
      provide: RESERVATION_WISH_NOTIFICATION_PORT,
      useClass: ReservationWishEmailNotificationAdapter,
    },
    {
      provide: RESERVATION_NOTIFICATION_PORT,
      useClass: ReservationEmailNotificationAdapter,
    },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
  exports: [
    GetReservationsService,
    GetReservationWishesService,
    UpdateReservationWishService,
    CreateReservationService,
  ],
})
export class ReservationModule {}
