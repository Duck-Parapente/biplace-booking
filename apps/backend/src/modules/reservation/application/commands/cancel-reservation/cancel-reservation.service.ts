import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CancelReservationCommand } from './cancel-reservation.command';

@CommandHandler(CancelReservationCommand)
export class CancelReservationService implements ICommandHandler<CancelReservationCommand, void> {
  private readonly logger = new Logger(CancelReservationService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute({ reservation, metadata }: CancelReservationCommand): Promise<void> {
    reservation.cancel(metadata);
    await this.reservationRepository.updateStatus(reservation);

    this.logger.log(`Reservation ${reservation.id.uuid} cancelled`);
  }
}
