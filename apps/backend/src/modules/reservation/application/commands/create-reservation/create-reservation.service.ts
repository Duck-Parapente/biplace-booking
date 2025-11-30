import { DomainEventMetadata } from '@libs/ddd';
import { DateValueObject } from '@libs/ddd/date.value-object';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { ReservationDomainService } from '@modules/reservation/domain/reservation.domain-service';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import { CreateReservationProps } from '@modules/reservation/domain/reservation.types';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GetReservationWishesService } from '../../queries/get-reservation-wishes/get-reservation-wishes.service';
import { CreateReservationWishService } from '../create-reservation-wish/create-reservation-wish.service';
import { UpdateReservationWishService } from '../update-reservation-wish/update-reservation-wish.service';

import { CreateReservationCommand } from './create-reservation.command';

@CommandHandler(CreateReservationCommand)
export class CreateReservationsService implements ICommandHandler<CreateReservationCommand, void> {
  private readonly logger = new Logger(CreateReservationsService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    protected readonly reservationRepository: ReservationRepositoryPort,
    protected readonly reservationDomainService: ReservationDomainService,
    protected readonly updateReservationWishService: UpdateReservationWishService,
    protected readonly createReservationWishService: CreateReservationWishService,
    protected readonly getReservationWishesService: GetReservationWishesService,
  ) {}

  async execute({ reservation, metadata }: CreateReservationCommand): Promise<void> {
    await this.reservationDomainService.validateCreateReservation(reservation);
    const updatedReservation = this.createWishIfNeeded(reservation, metadata);
    const entity = ReservationEntity.create(reservation, metadata);
    await this.reservationRepository.create(entity);
    await this.updateReservationWishService.confirmReservationWish(
      reservation.reservationWishId,
      metadata,
    );
    await this.refuseUnattributedWishes(reservation.startingDate, metadata);
  }

  private async refuseUnattributedWishes(
    startingDate: DateValueObject,
    metadata: DomainEventMetadata,
  ): Promise<void> {
    const pendingWishes =
      await this.getReservationWishesService.findPendingAndRefusedByStartingDate(startingDate);

    for (const wish of pendingWishes) {
      await this.updateReservationWishService.refuseReservationWish(wish.id, metadata);
    }
  }

  private createWishIfNeeded(
    reservation: CreateReservationProps,
    metadata: DomainEventMetadata,
  ): CreateReservationProps {
    if (reservation.reservationWishId) return reservation;

    this.logger.log(
      `No reservation wish associated with the reservation for user ${reservation.userId}. Creating a new wish.`,
    );
    const wish = this.createReservationWishService.execute(
      reservation.userId,
      reservation.startingDate,
      metadata,
    );

    return {
      ...reservation,
      reservationWishId: wish.id,
    };
  }
}
