import { DateValueObject } from '@libs/ddd/date.value-object';
import { PackSummary } from '@libs/types/accross-modules';
import { ReservationRepositoryPort } from '@modules/reservation/domain/ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '@modules/reservation/reservation.di-tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetReservationsService {
  private readonly logger = new Logger(GetReservationsService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  findAvailablePacks(
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<PackSummary[]> {
    return this.reservationRepository.findAvailablePacks(startingDate, endingDate);
  }
}
