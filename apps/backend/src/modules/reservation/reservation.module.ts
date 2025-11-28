import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { Module } from '@nestjs/common';

import { PackModule } from '../pack/pack.module';

import { CreateReservationsService } from './application/commands/create-reservation/create-reservation.service';
import { CreateReservationWishService } from './application/commands/create-reservation-wish/create-reservation-wish.service';
import { UpdateReservationWishService } from './application/commands/update-reservation-wish/update-reservation-wish.service';
import { GetPlanningService } from './application/queries/get-planning/get-planning.service';
import { GetReservationWishesService } from './application/queries/get-reservation-wishes/get-reservation-wishes.service';
import { PlanningDomainService } from './domain/planning.domain-service';
import { ReservationWishDomainService } from './domain/reservation-wish.domain-service';
import { ReservationDomainService } from './domain/reservation.domain-service';
import { EmailNotificationAdapter } from './infrastructure/adapters/email-notification.adapter';
import { CreateReservationWishHttpController } from './infrastructure/http/controllers/create-reservation-wish.http.controller';
import { GetPlanningHttpController } from './infrastructure/http/controllers/get-planning.http.controller';
import { GetReservationWishesHttpController } from './infrastructure/http/controllers/get-reservation-wishes.http.controller';
import { UpdateReservationWishHttpController } from './infrastructure/http/controllers/update-reservation-wish.http.controller';
import { ReservationWishRepository } from './infrastructure/persistence/reservation-wish.repository';
import { ReservationRepository } from './infrastructure/persistence/reservation.repository';
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
