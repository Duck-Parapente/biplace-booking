import { FlightLogRepositoryPort } from '@modules/reservation/domain/ports/flight-log.repository.port';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import {
  FLIGHT_LOG_REPOSITORY,
  RESERVATION_REPOSITORY,
} from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CloseReservationCommand } from './close-reservation.command';

@CommandHandler(CloseReservationCommand)
export class CloseReservationService implements ICommandHandler<CloseReservationCommand, void> {
  private readonly logger = new Logger(CloseReservationService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
    @Inject(FLIGHT_LOG_REPOSITORY)
    private readonly flightLogRepository: FlightLogRepositoryPort,
  ) {}

  async execute({ reservation, flightLog, metadata }: CloseReservationCommand): Promise<void> {
    const closedReservation = reservation.close(flightLog, metadata);

    await this.reservationRepository.update(closedReservation);
    await this.flightLogRepository.create(reservation.id, flightLog);

    this.logger.log(`Reservation ${reservation.id.uuid} closed`);
  }
}
