import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Inject, Injectable } from '@nestjs/common';

import { RESERVATION_REPOSITORY } from '../reservation.di-tokens';

import { ReservationRepositoryPort } from './ports/reservation.repository.port';
import { CannotCreateReservationException } from './reservation.exceptions';
import { CreateReservationProps } from './reservation.types';

@Injectable()
export class ReservationDomainService {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async validateCreateReservation(props: CreateReservationProps): Promise<void> {
    await this.checkNoExistingReservation(props.packId, props.startingDate, props.endingDate);
  }

  private async checkNoExistingReservation(
    packId: UUID,
    startingDate: DateValueObject,
    endingDate: DateValueObject,
  ): Promise<void> {
    const hasExistingReservation = await this.reservationRepository.existsByPackAndDate(
      packId,
      startingDate,
      endingDate,
    );

    if (hasExistingReservation) {
      throw new CannotCreateReservationException(packId, startingDate);
    }
  }
}
