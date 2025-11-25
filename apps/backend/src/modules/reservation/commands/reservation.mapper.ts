import { ReservationStatusDto, ReservationWishDto } from 'shared';

import { ReservationWishEntity } from '../domain/reservation-wish.entity';
import { ReservationWishStatus } from '../domain/reservation.types';

const mapStatus = (status: ReservationWishStatus): ReservationStatusDto => {
  switch (status) {
    case ReservationWishStatus.PENDING:
      return ReservationStatusDto.PENDING;
    case ReservationWishStatus.CONFIRMED:
      return ReservationStatusDto.CONFIRMED;
    case ReservationWishStatus.REFUSED:
      return ReservationStatusDto.REFUSED;
    case ReservationWishStatus.CANCELLED:
      return ReservationStatusDto.CANCELLED;
    default:
      throw new Error(`Unknown ReservationWishStatus: ${status}`);
  }
};

export function mapReservationWishToDto(
  reservationWish: ReservationWishEntity,
): ReservationWishDto {
  return {
    id: reservationWish.id.uuid,
    createdAt: reservationWish.createdAt.value,
    startingDate: reservationWish.startingDate.value,
    endingDate: reservationWish.endingDate.value,
    packChoices: reservationWish.packChoices.map((packChoice) => packChoice.uuid),
    status: mapStatus(reservationWish.status),
    publicComment: reservationWish.publicComment,
    reservations: reservationWish.reservations,
  };
}
