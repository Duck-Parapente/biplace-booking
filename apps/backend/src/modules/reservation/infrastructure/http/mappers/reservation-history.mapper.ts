import {
  ReservationEvent,
  ReservationWishWithHistory,
} from '@modules/reservation/domain/reservation-wish.read-models';
import { ReservationWishStatus } from '@modules/reservation/domain/reservation-wish.types';
import { ReservationStatus } from '@modules/reservation/domain/reservation.types';
import { ReservationWishDto, ReservationWishStatusDto, EventType } from 'shared';

const mapWishStatusToDto = (status: ReservationWishStatus): ReservationWishStatusDto => {
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

const mapReservationStatusToDto = (status: ReservationStatus): ReservationWishStatusDto => {
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

const mapCostUpdateToDto = (event: ReservationEvent): { cost: number; date: string } => ({
  cost: event.cost.value,
  date: event.occurredAt.value.toISOString(),
});

/**
 * Maps domain read model to DTO with separated status updates and cost updates
 */
export function mapReservationWishWithHistoryToDto(
  wishWithHistory: ReservationWishWithHistory,
): ReservationWishDto {
  const { wishHistory, reservationHistory } = wishWithHistory;
  const wish = wishHistory.wish;

  return {
    id: wish.id.uuid,
    createdAt: wish.createdAt.value.toISOString(),
    isCancelable: wish.isCancelable(),
    startingDate: wish.startingDate.value.toISOString(),
    endingDate: wish.endingDate.value.toISOString(),
    packChoices: wish.packChoices.map((packChoice) => packChoice.uuid),
    publicComment: wish.publicComment,
    reservation: reservationHistory
      ? {
          id: reservationHistory.reservation.id.uuid,
          packId: reservationHistory.reservation.packId.uuid,
          isCancelable: reservationHistory.reservation.isCancelable(),
          isClosable: reservationHistory.reservation.isClosable(),
          cost: reservationHistory.reservation.cost.value,
        }
      : null,
    statusUpdates: [
      ...wishHistory.statusUpdates.map((update) => ({
        status: mapWishStatusToDto(update.status as ReservationWishStatus),
        date: update.occurredAt.value.toISOString(),
        type: EventType.WISH,
      })),
      ...(reservationHistory?.statusUpdates.map((update) => ({
        status: mapReservationStatusToDto(update.status as ReservationStatus),
        date: update.occurredAt.value.toISOString(),
        type: EventType.RESERVATION,
      })) ?? []),
    ],
    costUpdates: reservationHistory?.otherEvents.map(mapCostUpdateToDto) ?? [],
  };
}
