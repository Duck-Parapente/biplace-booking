import {
  ReservationWishStatus,
  ReservationWishWithReservation,
} from '@modules/reservation/domain/reservation-wish.types';
import { PlanningData } from '@modules/reservation/domain/reservation.types';
import { ReservationStatusDto, ReservationWishDto, PlanningDayDto } from 'shared';

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

export function mapReservationWishToDto({
  reservations,
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
    status: mapStatus(reservationWish.status),
    publicComment: reservationWish.publicComment,
    reservations: reservations.map(({ id, packId }) => ({
      id: id.uuid,
      packId: packId.uuid,
    })),
    events: events.map(({ status, date }) => ({
      status: mapStatus(status),
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
