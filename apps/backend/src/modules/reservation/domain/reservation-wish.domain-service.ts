import { DateValueObject } from '@libs/ddd/date.value-object';
import { UUID } from '@libs/ddd/uuid.value-object';
import { Inject, Injectable } from '@nestjs/common';

import { RESERVATION_WISH_REPOSITORY } from '../reservation.di-tokens';

import { ReservationWishRepositoryPort } from './ports/reservation-wish.repository.port';
import { UserHasReservationWishOnStartingDateError } from './reservation-wish.exceptions';
import { CreateReservationWishProps } from './reservation-wish.types';

@Injectable()
export class ReservationWishDomainService {
  constructor(
    @Inject(RESERVATION_WISH_REPOSITORY)
    private readonly reservationWishRepository: ReservationWishRepositoryPort,
  ) {}

  async validateCreateReservationWish(props: CreateReservationWishProps): Promise<void> {
    await this.checkNoDuplicateWishForUser(props.startingDate, props.createdById);
  }

  private async checkNoDuplicateWishForUser(
    startingDate: DateValueObject,
    userId: UUID,
  ): Promise<void> {
    const hasExistingWishOnStartingDate =
      await this.reservationWishRepository.existsNotCancelledForStartingDateAndUser(
        startingDate,
        userId,
      );

    if (hasExistingWishOnStartingDate) {
      throw new UserHasReservationWishOnStartingDateError(userId, startingDate);
    }
  }
}
