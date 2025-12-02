import {
  ReservationWishStatus,
  ReservationWishWithReservation,
} from '@modules/reservation/domain/reservation-wish.types';
import { PlanningData, ReservationStatus } from '@modules/reservation/domain/reservation.types';
import {
  ReservationStatusDto,
  ReservationWishDto,
  PlanningDayDto,
  ReservationWishStatusDto,
} from 'shared';

const mapWishStatus = (status: ReservationWishStatus): ReservationWishStatusDto => {
  switch (status) {
    case ReservationWishStatus.PENDING:
      return ReservationWishStatusDto.PENDING;
    case ReservationWishStatus.CONFIRMED:
      return ReservationWishStatusDto.CONFIRMED;
    case ReservationWishStatus.REFUSED:
      return ReservationWishStatusDto.REFUSED;
    case ReservationWishStatus.CANCELLED:
      return ReservationWishStatusDto.CANCELLED;
    default:
      throw new Error(`Unknown ReservationWishStatus: ${status}`);
  }
};

const mapReservationStatus = (status: ReservationStatus): ReservationStatusDto => {
  switch (status) {
    case ReservationStatus.CONFIRMED:
      return ReservationStatusDto.CONFIRMED;
    case ReservationStatus.CANCELLED:
      return ReservationStatusDto.CANCELLED;
    default:
      throw new Error(`Unknown ReservationStatus: ${status}`);
  }
};

export function mapReservationWishToDto({
  reservation,
  reservationWish,
  events,
}: ReservationWishWithReservation): ReservationWishDto {
  return {
    id: reservationWish.id.uuid,
    createdAt: reservationWish.createdAt.value,
    isCancelable: reservationWish.isCancelable(),
    startingDate: reservationWish.startingDate.value,
    endingDate: reservationWish.endingDate.value,
    packChoices: reservationWish.packChoices.map((packChoice) => packChoice.uuid),
    status: mapWishStatus(reservationWish.status),
    publicComment: reservationWish.publicComment,
    reservation: reservation
      ? {
          id: reservation.id.uuid,
          packId: reservation.packId.uuid,
          status: mapReservationStatus(reservation.status),
        }
      : null  ,
    events: events.map(({ status, date }) => ({
      status: mapWishStatus(status),
      date: date.value,
    })),
  };
}

export function mapPlanningDataToDto(planningData: PlanningData[]): PlanningDayDto[] {
  return planningData.map(({ date, packs }) => ({
    date: date.value,
    packs: packs.map(({ packId, packLabel, pendingWishesCount, reservation }) => ({
      packId: packId.uuid,
      packLabel,
      pendingWishesCount,
      reservation: reservation
        ? {
            userId: reservation.userId?.uuid,
            publicComment: reservation.publicComment || null,
          }
        : null,
    })),
  }));
}
