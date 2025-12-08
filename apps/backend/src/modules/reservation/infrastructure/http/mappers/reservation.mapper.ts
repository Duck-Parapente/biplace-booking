import {
  ReservationWishStatus,
  ReservationWishWithReservation,
} from '@modules/reservation/domain/reservation-wish.types';
import {
  PackReservationsWithDetails,
  PlanningData,
  ReservationStatus,
} from '@modules/reservation/domain/reservation.types';
import {
  ReservationWishDto,
  PlanningDayDto,
  ReservationWishStatusDto,
  PackReservationsDto,
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

const mapReservationStatusToWishStatus = (status: ReservationStatus): ReservationWishStatusDto => {
  switch (status) {
    case ReservationStatus.CONFIRMED:
      return ReservationWishStatusDto.CONFIRMED;
    case ReservationStatus.CANCELLED:
      return ReservationWishStatusDto.CANCELLED;
    case ReservationStatus.CLOSED:
      return ReservationWishStatusDto.CLOSED;
    default:
      throw new Error(`Unknown ReservationStatus: ${status}`);
  }
};

export function mapReservationWishToDto({
  reservation,
  reservationWish: { entity: reservationWish, events: reservationWishEvents },
}: ReservationWishWithReservation): ReservationWishDto {
  return {
    id: reservationWish.id.uuid,
    createdAt: reservationWish.createdAt.value.toISOString(),
    isCancelable: reservationWish.isCancelable(),
    startingDate: reservationWish.startingDate.value.toISOString(),
    endingDate: reservationWish.endingDate.value.toISOString(),
    packChoices: reservationWish.packChoices.map((packChoice) => packChoice.uuid),
    publicComment: reservationWish.publicComment,
    reservation: reservation
      ? {
          id: reservation.entity.id.uuid,
          packId: reservation.entity.packId.uuid,
          isCancelable: reservation.entity.isCancelable(),
          isClosable: reservation.entity.isClosable(),
          cost: reservation.entity.cost.value,
        }
      : null,
    events: [
      ...reservationWishEvents.map((event) => ({
        status: mapWishStatus(event.status),
        date: event.date.value.toISOString(),
      })),
      ...(reservation
        ? reservation.events.map((event) => ({
            status: mapReservationStatusToWishStatus(event.status),
            date: event.date.value.toISOString(),
          }))
        : []),
    ],
  };
}

export function mapPlanningDataToDto(planningData: PlanningData[]): PlanningDayDto[] {
  return planningData.map(({ date, packs }) => ({
    date: date.value.toISOString(),
    packs: packs.map(({ packId, packLabel, pendingWishesCount, reservation }) => ({
      packId: packId.uuid,
      packLabel,
      pendingWishesCount,
      reservation: reservation
        ? {
            id: reservation.id.uuid,
            userId: reservation.userId?.uuid,
            publicComment: reservation.publicComment || null,
            isCancelable: reservation.isCancelable,
          }
        : null,
    })),
  }));
}

export function mapPackReservationsToDto({
  totalFlightsCount,
  totalFlightsHours,
  packReservations,
}: PackReservationsWithDetails): PackReservationsDto {
  return {
    reservations: packReservations.map((reservation) => ({
      id: reservation.id.uuid,
      startingDate: reservation.startingDate.value.toISOString(),
      endingDate: reservation.endingDate.value.toISOString(),
      userName: reservation.userName ?? null,
      flightLog: reservation.flightLog
        ? {
            flightTimeMinutes: reservation.flightLog.flightTimeMinutes.value,
            flightsCount: reservation.flightLog.flightsCount.value,
            publicComment: reservation.flightLog.publicComment ?? null,
            privateComment: reservation.flightLog.privateComment ?? null,
          }
        : null,
    })),
    totalFlightsCount: totalFlightsCount.value,
    totalFlightsHours: totalFlightsHours.value,
  };
}
