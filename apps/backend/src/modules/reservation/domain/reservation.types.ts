import { DateValueObject } from '@libs/ddd/date.value-object';
import { Integer } from '@libs/ddd/integer.value-object';
import { UUID, UuidProps } from '@libs/ddd/uuid.value-object';

interface BaseReservationProps {
  packId: UUID;
  userId?: UUID;
  startingDate: DateValueObject;
  endingDate: DateValueObject;
  publicComment?: string;
  reservationWishId?: UUID;
}

export type CreateReservationProps = BaseReservationProps;
export type ReservationProps = BaseReservationProps & {
  cost: Integer;
  status: ReservationStatus;
};

export type PlanningReservationDto = BaseReservationProps & {
  id: UUID;
  isCancelable: boolean;
};

export interface PlanningPackData {
  packId: UuidProps;
  packLabel: string;
  pendingWishesCount: number;
  reservation: PlanningReservationDto | null;
}

export interface PlanningData {
  date: DateValueObject;
  packs: PlanningPackData[];
}

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

export interface FlightLogProps {
  flightTimeMinutes: Integer;
  flightsCount: Integer;
  publicComment?: string;
  shouldWarnPackOwner?: boolean;
}

interface PackReservation {
  id: UUID;
  startingDate: DateValueObject;
  endingDate: DateValueObject;
  status: ReservationStatus;
  cost: Integer;
  userName?: string;
  flightLog?: FlightLogProps;
}

export type PackReservationsWithDetails = {
  packReservations: PackReservation[];
  totalFlightsCount: Integer;
  totalFlightsHours: Integer;
};
