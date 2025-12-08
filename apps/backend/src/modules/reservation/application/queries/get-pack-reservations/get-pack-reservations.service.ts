import { UUID } from '@libs/ddd/uuid.value-object';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { PackReservationsWithDetails } from '@modules/reservation/domain/reservation.types';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetPackReservationsService {
  private readonly logger = new Logger(GetPackReservationsService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(packId: UUID): Promise<PackReservationsWithDetails> {
    this.logger.log(`Getting closed and confirmed reservations for pack ${packId.uuid}`);
    return this.reservationRepository.findClosedAndConfirmedReservationsByPackId(packId);
  }
}
