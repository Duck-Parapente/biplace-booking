import { DateValueObject } from '@libs/ddd/date.value-object';
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
  status: ReservationStatus;
};

export type PlanningReservationDto = BaseReservationProps & {
  id: UUID;
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
}
