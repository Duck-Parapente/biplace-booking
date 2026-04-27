import {
  PackReservationsWithDetails,
  PlanningData,
  ReservationStatus,
} from '@modules/reservation/domain/reservation.types';
import { PlanningDayDto, ReservationWishStatusDto, PackReservationsDto } from 'shared';

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
  totalFlightsMinutes,
  packReservations,
  ownerFullName,
  description,
  details,
  lastControlDate,
  lastRescueFoldingDate,
  flightsMinutesSinceLastControlDate,
}: PackReservationsWithDetails): PackReservationsDto {
  return {
    reservations: packReservations.map((reservation) => ({
      id: reservation.id.uuid,
      startingDate: reservation.startingDate.value.toISOString(),
      endingDate: reservation.endingDate.value.toISOString(),
      userId: reservation.userId?.uuid ?? null,
      status: mapReservationStatusToWishStatus(reservation.status),
      manualCost: reservation.manualCost?.value ?? null,
      automaticCost: reservation.automaticCost?.value ?? null,
      flightLog: reservation.flightLog
        ? {
            flightTimeMinutes: reservation.flightLog.flightTimeMinutes.value,
            flightsCount: reservation.flightLog.flightsCount.value,
            publicComment: reservation.flightLog.publicComment ?? null,
          }
        : null,
    })),
    totalFlightsCount: totalFlightsCount.value,
    totalFlightsMinutes: totalFlightsMinutes.value,
    ownerFullName,
    description: description ?? null,
    details: details ?? null,
    lastControlDate: lastControlDate?.value.toISOString() ?? null,
    lastRescueFoldingDate: lastRescueFoldingDate?.value.toISOString() ?? null,
    flightsMinutesSinceLastControlDate: flightsMinutesSinceLastControlDate?.value ?? null,
  };
}
