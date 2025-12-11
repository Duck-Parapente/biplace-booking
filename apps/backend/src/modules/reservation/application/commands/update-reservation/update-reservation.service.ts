import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateReservationCommand } from './update-reservation.command';

@CommandHandler(UpdateReservationCommand)
export class UpdateReservationService implements ICommandHandler<UpdateReservationCommand, void> {
  private readonly logger = new Logger(UpdateReservationService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute({ reservation, cost, metadata }: UpdateReservationCommand): Promise<void> {
    const updatedReservation = reservation.updateCost(cost, metadata);

    await this.reservationRepository.update(updatedReservation);

    this.logger.log(`Reservation ${reservation.id.uuid} updated with cost ${cost.value}`);
  }
}
