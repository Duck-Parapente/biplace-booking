import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../reservation.di-tokens';

@Injectable()
export class GetReservationsService {
  private readonly logger = new Logger(GetReservationsService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    protected readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  existsByPackAndDate(
    packId: UUID,
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<boolean> {
    return this.reservationRepository.existsByPackAndDate(packId, startingDate, endingDate);
  }
}
