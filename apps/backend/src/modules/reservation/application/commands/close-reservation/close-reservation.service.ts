import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CloseReservationCommand } from './close-reservation.command';

@CommandHandler(CloseReservationCommand)
export class CloseReservationService implements ICommandHandler<CloseReservationCommand, void> {
  private readonly logger = new Logger(CloseReservationService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute({ reservation, flightLog, metadata }: CloseReservationCommand): Promise<void> {
    const closedReservation = reservation.close(flightLog, metadata);

    // Create the flight log
    await prisma.flightLog.create({
      data: {
        id: UUID.random().uuid,
        reservationId: reservation.id.uuid,
        flightsMinutes: flightLog.flightTimeMinutes.value,
        flightsCount: flightLog.flightCount.value,
        publicComment: flightLog.publicComment ?? null,
        privateComment: flightLog.privateComment ?? null,
        createdAt: new Date(),
      },
    });

    await this.reservationRepository.update(closedReservation);

    this.logger.log(`Reservation ${reservation.id.uuid} closed`);
  }
}
