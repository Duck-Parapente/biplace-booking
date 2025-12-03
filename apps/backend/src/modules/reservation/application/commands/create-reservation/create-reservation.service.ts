import { DomainEventMetadata } from '@libs/ddd';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { ReservationDomainService } from '@modules/reservation/domain/reservation.domain-service';
import { ReservationEntity } from '@modules/reservation/domain/reservation.entity';
import { CreateReservationProps } from '@modules/reservation/domain/reservation.types';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateReservationWishCommand } from '../create-reservation-wish/create-reservation-wish.command';
import { CreateReservationWishService } from '../create-reservation-wish/create-reservation-wish.service';
import { UpdateReservationWishService } from '../update-reservation-wish/update-reservation-wish.service';

import { CreateReservationCommand } from './create-reservation.command';

@CommandHandler(CreateReservationCommand)
export class CreateReservationService implements ICommandHandler<CreateReservationCommand, void> {
  private readonly logger = new Logger(CreateReservationService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
    private readonly reservationDomainService: ReservationDomainService,
    private readonly updateReservationWishService: UpdateReservationWishService,
    private readonly createReservationWishService: CreateReservationWishService,
  ) {}

  async execute({
    reservation: inputReservation,
    metadata,
  }: CreateReservationCommand): Promise<void> {
    await this.reservationDomainService.validateCreateReservation(inputReservation);
    const reservation = await this.createWishIfNeeded(inputReservation, metadata);

    const entity = ReservationEntity.create(reservation, metadata);
    await this.reservationRepository.create(entity);

    if (reservation.reservationWishId) {
      await this.updateReservationWishService.confirmReservationWish(
        reservation.reservationWishId,
        metadata,
      );
    }
  }

  private async createWishIfNeeded(
    reservation: CreateReservationProps,
    metadata: DomainEventMetadata,
  ): Promise<CreateReservationProps> {
    if (reservation.reservationWishId || !reservation.userId) return reservation;

    this.logger.log(
      `No reservation wish associated with the reservation for user ${reservation.userId}. Creating a new wish.`,
    );

    const command = new CreateReservationWishCommand({
      reservationWish: {
        startingDate: reservation.startingDate,
        packChoices: [reservation.packId],
        publicComment: reservation.publicComment,
        userId: reservation.userId,
      },
      metadata,
    });

    const wishId = await this.createReservationWishService.execute(command);

    return {
      ...reservation,
      reservationWishId: wishId,
    };
  }
}
