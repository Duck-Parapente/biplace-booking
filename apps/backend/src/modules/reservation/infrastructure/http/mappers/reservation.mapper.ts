import {
  ReservationWishStatus,
  ReservationWishWithReservation,
} from '@modules/reservation/domain/reservation-wish.types';
import { PlanningData, ReservationStatus } from '@modules/reservation/domain/reservation.types';
import { ReservationOrWishStatusDto } from 'shared';
import { ReservationWishDto, PlanningDayDto, ReservationEventTypeDto } from 'shared';

const mapWishStatus = (status: ReservationWishStatus): ReservationOrWishStatusDto => {
  switch (status) {
    case ReservationWishStatus.PENDING:
      return ReservationOrWishStatusDto.PENDING;
    case ReservationWishStatus.CONFIRMED:
      return ReservationOrWishStatusDto.CONFIRMED;
    case ReservationWishStatus.REFUSED:
      return ReservationOrWishStatusDto.REFUSED;
    case ReservationWishStatus.CANCELLED:
      return ReservationOrWishStatusDto.CANCELLED;
    default:
      throw new Error(`Unknown ReservationWishStatus: ${status}`);
  }
};

const mapReservationStatus = (status: ReservationStatus): ReservationOrWishStatusDto => {
  switch (status) {
    case ReservationStatus.CONFIRMED:
      return ReservationOrWishStatusDto.CONFIRMED;
    case ReservationStatus.CANCELLED:
      return ReservationOrWishStatusDto.CANCELLED;
    default:
      throw new Error(`Unknown ReservationStatus: ${status}`);
  }
};

export function mapReservationWishToDto({
  reservation,
  reservationWish: { entity: reservationWish, events },
}: ReservationWishWithReservation): ReservationWishDto {
  return {
    id: reservationWish.id.uuid,
    createdAt: reservationWish.createdAt.value,
    isCancelable: reservationWish.isCancelable(),
    startingDate: reservationWish.startingDate.value,
    endingDate: reservationWish.endingDate.value,
    packChoices: reservationWish.packChoices.map((packChoice) => packChoice.uuid),
    publicComment: reservationWish.publicComment,
    reservation: reservation
      ? {
          id: reservation.entity.id.uuid,
          packId: reservation.entity.packId.uuid,
        }
      : null,
    events: [
      ...events.map((event) => ({
        status: mapWishStatus(event.status),
        type: ReservationEventTypeDto.WISH,
        date: event.date.value,
      })),
      ...(reservation
        ? reservation.events.map((event) => ({
            status: mapReservationStatus(event.status),
            type: ReservationEventTypeDto.RESERVATION,
            date: event.date.value,
          }))
        : []),
    ],
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
