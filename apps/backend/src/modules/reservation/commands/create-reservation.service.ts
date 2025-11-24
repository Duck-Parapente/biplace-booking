import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { ReservationRepositoryPort } from '../domain/ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../reservation.di-tokens';

@Injectable()
export class CreateReservationsService {
  private readonly logger = new Logger(CreateReservationsService.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    protected readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async create(props: {
    packId: UUID;
    userId: UUID;
    startingDate: DateValueObject;
    endingDate: DateValueObject;
    reservationWishId: UUID;
    publicComment?: string;
  }): Promise<void> {
    this.logger.warn(`Will create reservation with props: ${JSON.stringify(props)}`);
    throw new Error('Method not implemented.');
  }
}
